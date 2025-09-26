import React, { useEffect, useState } from "react";
import { getTopAnime, getUpcomingAnime, getTopManga, getCurrentlyAiring, Media } from "../utils/api";
import { useNavigate } from "react-router-dom";

const Homepage: React.FC = () => {
    const navigate = useNavigate();
    const [animes, setAnimes] = useState<Media[]>([]);
    const [upcomingAnimes, setUpcomingAnimes] = useState<Media[]>([]);
    const [currentlyAiring, setCurrentlyAiring] = useState<Media[]>([]);
    const [topMangas, setTopMangas] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [topAnime, upcoming, airing, topManga] = await Promise.all([
                    getTopAnime(5),
                    getUpcomingAnime(5),
                    getCurrentlyAiring(5),
                    getTopManga(5),
                ]);

                setAnimes(topAnime);
                setUpcomingAnimes(upcoming);
                setCurrentlyAiring(airing);
                setTopMangas(topManga);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading)
        return <div className="text-center mt-20 text-xl text-gray-300">Loading...</div>;

    const renderCard = (media: Media, type: "anime" | "manga" = "anime") => (
        <div
            key={media.mal_id}
            className="bg-gray-800 rounded-md shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden cursor-pointer"
            onClick={() => navigate(`/${type}/${media.mal_id}`)} // <- navigasi ke /anime/:id atau /manga/:id
        >
            <img
                src={media.images.jpg.image_url}
                alt={media.title}
                className="w-full h-64 object-cover rounded-t-md"
            />
            <div className="p-5">
                <h2 className="font-semibold text-lg md:text-xl mb-2 hover:text-indigo-400 transition-colors">
                    {media.title}
                </h2>
                <p className="text-gray-400 mb-1">⭐ {media.score ?? "N/A"}</p>
                <p className="text-sm text-gray-500 capitalize">Status: {media.status}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <div className="container mx-auto p-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white tracking-wide">
                    Top 5 Anime
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
                    {animes.map(a => renderCard(a, "anime"))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white tracking-wide">
                    This Seasons
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
                    {currentlyAiring.map(a => renderCard(a, "anime"))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white tracking-wide">
                    Upcoming Anime
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
                    {upcomingAnimes.map(a => renderCard(a, "anime"))}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white tracking-wide">
                    Top 5 Manga
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {topMangas.map(m => renderCard(m, "manga"))}
                </div>
            </div>
        </div>
    );
};

export default Homepage;
