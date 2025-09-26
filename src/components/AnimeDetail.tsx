import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnimeDetail, AnimeDetail } from "../utils/api";

const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const data = await getAnimeDetail(Number(id));
      setAnime(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl text-gray-300">Loading...</div>
    );

  if (!anime)
    return (
      <div className="text-center mt-20 text-xl text-gray-300">Anime not found</div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto max-w-screen-lg p-6">
        {/* Tombol Back */}
        <button
          className="mb-6 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster anime */}
          <div className="flex-shrink-0 md:w-72">
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="w-full h-auto rounded-lg shadow-md object-contain"
            />
          </div>

          {/* Detail anime */}
          <div className="flex-1 leading-relaxed">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{anime.title}</h1>

            {anime.title_english && (
              <h2 className="text-lg text-gray-400 mb-1">
                English: {anime.title_english}
              </h2>
            )}
            {anime.title_japanese && (
              <h2 className="text-lg text-gray-400 mb-3">
                Japanese: {anime.title_japanese}
              </h2>
            )}

            <ul className="text-gray-300 space-y-1 mb-4">
              <li>⭐ Score: {anime.score ?? "N/A"}</li>
              <li>Rank: {anime.rank ?? "N/A"}</li>
              <li>Popularity: {anime.popularity ?? "N/A"}</li>
              <li>Status: {anime.status ?? "N/A"}</li>
              <li>Episodes: {anime.episodes ?? "N/A"}</li>
              <li>
                Aired:{" "}
                {anime.aired?.from
                  ? new Date(anime.aired.from).toLocaleDateString()
                  : "N/A"}{" "}
                –{" "}
                {anime.aired?.to
                  ? new Date(anime.aired.to).toLocaleDateString()
                  : "N/A"}
              </li>
              {anime.studios?.length ? (
                <li>Studios: {anime.studios.map((s) => s.name).join(", ")}</li>
              ) : null}
              {anime.genres?.length ? (
                <li>Genres: {anime.genres.map((g) => g.name).join(", ")}</li>
              ) : null}
            </ul>

            {anime.synopsis && (
              <p className="text-gray-200 text-justify">{anime.synopsis}</p>
            )}

            {/* Trailer opsional */}
            {anime.trailer?.embed_url && (
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-2">Trailer</h3>
                <iframe
                  className="w-full h-64 rounded-lg"
                  src={anime.trailer.embed_url}
                  title="Anime Trailer"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetailPage;
