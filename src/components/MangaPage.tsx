'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMangaList, Media } from '../utils/api';

const MangaPage: React.FC = () => {
  const [mangaList, setMangaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');

  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState('');
  const [orderBy, setOrderBy] = useState('score');
  const [sort, setSort] = useState('desc');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getMangaList(page, query, genre, status, orderBy, sort);
      setMangaList(res.data);
      setTotalPages(res.last_page);
      setLoading(false);
    };
    fetchData();
  }, [page, query, genre, status, orderBy, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(searchInput.trim());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Manga List</h1>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search manga..."
            className="flex-1 px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={genre}
            onChange={(e) => { setGenre(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
          >
            <option value="">All Genres</option>
            <option value="1">Action</option>
            <option value="2">Adventure</option>
            <option value="4">Comedy</option>
            <option value="8">Drama</option>
            <option value="10">Fantasy</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
          >
            <option value="">Any Status</option>
            <option value="publishing">Publishing</option>
            <option value="complete">Completed</option>
            <option value="hiatus">Hiatus</option>
            <option value="discontinued">Discontinued</option>
          </select>

          <select
            value={orderBy}
            onChange={(e) => { setOrderBy(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
          >
            <option value="score">Score</option>
            <option value="popularity">Popularity</option>
            <option value="favorites">Favorites</option>
            <option value="rank">Rank</option>
          </select>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-xl">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mangaList.map((manga) => (
                <div
                  key={manga.mal_id}
                  className="bg-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/manga/${manga.mal_id}`)}
                >
                  <img
                    src={manga.images.jpg.image_url}
                    alt={manga.title}
                    className="w-full h-60 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-semibold mb-1 line-clamp-2">
                      {manga.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      ⭐ {manga.score ?? 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded bg-blue-700 disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded bg-blue-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MangaPage;
