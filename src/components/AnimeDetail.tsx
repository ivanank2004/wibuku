import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeDetail, AnimeDetail } from "../utils/api";

const AnimeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return;
      const detail = await getAnimeDetail(Number(id));
      setAnime(detail);
      setLoading(false);
    };
    fetchAnime();
  }, [id]);

  if (loading)
    return <div className="text-center mt-20 text-xl text-gray-300">Loading...</div>;

  if (!anime)
    return <div className="text-center mt-20 text-xl text-gray-300">Anime not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="rounded-xl w-full object-cover shadow-lg"
        />
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-4">{anime.title}</h1>
          {anime.title_english && <h2 className="text-xl mb-2 text-gray-300">{anime.title_english}</h2>}
          {anime.title_japanese && <p className="text-gray-400 mb-2">{anime.title_japanese}</p>}

          <p className="mb-4 text-gray-200">{anime.synopsis}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres?.map((g) => (
              <span key={g.mal_id} className="bg-indigo-600 px-3 py-1 rounded-full text-sm">
                {g.name}
              </span>
            ))}
          </div>

          <div className="mb-2">
            <span className="font-semibold">Score:</span> {anime.score ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Rank:</span> {anime.rank ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Popularity:</span> {anime.popularity ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Episodes:</span> {anime.episodes ?? "N/A"}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Status:</span> {anime.status}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Aired:</span>{" "}
            {anime.aired?.from ? new Date(anime.aired.from).toLocaleDateString() : "N/A"} -{" "}
            {anime.aired?.to ? new Date(anime.aired.to).toLocaleDateString() : "N/A"}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Studios:</span>{" "}
            {anime.studios?.map((s) => s.name).join(", ")}
          </div>

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
  );
};

export default AnimeDetailPage;
