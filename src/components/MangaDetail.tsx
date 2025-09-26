import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMangaDetail, MangaDetail } from "../utils/api";

const MangaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const data = await getMangaDetail(Number(id));
      setManga(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl text-gray-300">Loading...</div>
    );
  if (!manga)
    return (
      <div className="text-center mt-20 text-xl text-gray-300">Manga not found</div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <div className="container mx-auto max-w-screen-lg p-6">
        <button
          className="mb-6 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 md:w-72">
            <img
              src={manga.images.jpg.image_url}
              alt={manga.title}
              className="w-full h-auto rounded-lg shadow-md object-contain"
            />
          </div>

          <div className="flex-1 leading-relaxed">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {manga.title}
            </h1>
            {manga.title_english && (
              <h2 className="text-lg text-gray-400 mb-1">
                English: {manga.title_english}
              </h2>
            )}
            {manga.title_japanese && (
              <h2 className="text-lg text-gray-400 mb-3">
                Japanese: {manga.title_japanese}
              </h2>
            )}

            <ul className="text-gray-300 space-y-1 mb-4">
              <li>⭐ Score: {manga.score ?? "N/A"}</li>
              <li>Rank: {manga.rank ?? "N/A"}</li>
              <li>Popularity: {manga.popularity ?? "N/A"}</li>
              <li>Status: {manga.status ?? "N/A"}</li>
              <li>
                Chapters: {manga.chapters ?? "N/A"}, Volumes:{" "}
                {manga.volumes ?? "N/A"}
              </li>
              <li>
                Published: {manga.published?.from ?? "Unknown"} –{" "}
                {manga.published?.to ?? "Unknown"}
              </li>
              {manga.authors?.length ? (
                <li>Authors: {manga.authors.map((a) => a.name).join(", ")}</li>
              ) : null}
              {manga.genres?.length ? (
                <li>Genres: {manga.genres.map((g) => g.name).join(", ")}</li>
              ) : null}
            </ul>

            {manga.synopsis && (
              <p className="text-gray-200 text-justify">{manga.synopsis}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetailPage;
