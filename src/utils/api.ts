// api.ts
export interface Media {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  score: number;
  status: string;
  season?: string;
  year?: number;
}

export interface AnimeDetail {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: { jpg: { image_url: string } };
  score?: number;
  rank?: number;
  popularity?: number;
  episodes?: number;
  status?: string;
  aired?: { from?: string; to?: string };
  synopsis?: string;
  genres?: { mal_id: number; name: string }[];
  studios?: { mal_id: number; name: string }[];
  trailer?: { youtube_id?: string; url?: string; embed_url?: string };
}

export interface MangaDetail {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: { jpg: { image_url: string } };
  score?: number;
  rank?: number;
  popularity?: number;
  chapters?: number;
  volumes?: number;
  status?: string;
  published?: { from?: string; to?: string };
  synopsis?: string;
  authors?: { mal_id: number; name: string; url: string }[];
  genres?: { mal_id: number; name: string }[];
}

// ----------------------
// Simple in-memory cache
const cache: Record<string, any> = {};

// ----------------------
// Fetch with retry
async function fetchWithRetry(url: string, retries = 3, delay = 1500): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.status === 429) {
      console.warn(`429 Too Many Requests, retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  }
  throw new Error("Too many retries, still rate limited");
}

// ----------------------
// Generic cached fetch
async function cachedFetch(key: string, url: string, limit?: number): Promise<any> {
  if (cache[key]) return cache[key];

  const data = await fetchWithRetry(url);
  const result = limit ? data.data.slice(0, limit) : data.data;
  cache[key] = result;
  return result;
}

// ----------------------
// API functions
export async function getTopAnime(limit = 5): Promise<Media[]> {
  try {
    const data = await cachedFetch("topAnime", `https://api.jikan.moe/v4/top/anime?limit=${limit}`, limit);
    return data.map((anime: any) => ({
      mal_id: anime.mal_id,
      title: anime.title,
      images: anime.images,
      score: anime.score,
      status: anime.status,
    }));
  } catch (err) {
    console.error("Failed to fetch top anime:", err);
    return [];
  }
}

export async function getUpcomingAnime(limit = 5): Promise<Media[]> {
  try {
    const data = await cachedFetch("upcomingAnime", `https://api.jikan.moe/v4/seasons/upcoming`, limit);
    return data.map((anime: any) => ({
      mal_id: anime.mal_id,
      title: anime.title,
      images: anime.images,
      score: anime.score ?? 0,
      status: anime.status ?? "upcoming",
    }));
  } catch (err) {
    console.error("Failed to fetch upcoming anime:", err);
    return [];
  }
}

export async function getCurrentlyAiring(limit = 5): Promise<Media[]> {
  try {
    const data = await cachedFetch("currentlyAiring", `https://api.jikan.moe/v4/seasons/now`, limit);
    return data.map((anime: any) => ({
      mal_id: anime.mal_id,
      title: anime.title,
      images: anime.images,
      score: anime.score ?? 0,
      status: anime.status ?? "airing",
    }));
  } catch (err) {
    console.error("Failed to fetch currently airing anime:", err);
    return [];
  }
}

export async function getTopManga(limit = 5): Promise<Media[]> {
  try {
    const data = await cachedFetch("topManga", `https://api.jikan.moe/v4/top/manga?limit=${limit}`, limit);
    return data.map((manga: any) => ({
      mal_id: manga.mal_id,
      title: manga.title,
      images: manga.images,
      score: manga.score,
      status: manga.status ?? "published",
    }));
  } catch (err) {
    console.error("Failed to fetch top manga:", err);
    return [];
  }
}

export async function getAnimeDetail(id: number): Promise<AnimeDetail | null> {
  const key = `animeDetail_${id}`;
  if (cache[key]) return cache[key];

  try {
    const res = await fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/full`);
    const anime = res.data;
    const detail: AnimeDetail = {
      mal_id: anime.mal_id,
      title: anime.title,
      title_english: anime.title_english,
      title_japanese: anime.title_japanese,
      images: anime.images,
      score: anime.score,
      rank: anime.rank,
      popularity: anime.popularity,
      episodes: anime.episodes,
      status: anime.status,
      aired: { from: anime.aired?.from, to: anime.aired?.to },
      synopsis: anime.synopsis,
      genres: anime.genres?.map((g: any) => ({ mal_id: g.mal_id, name: g.name })),
      studios: anime.studios?.map((s: any) => ({ mal_id: s.mal_id, name: s.name })),
      trailer: anime.trailer,
    };
    cache[key] = detail;
    return detail;
  } catch (err) {
    console.error("Failed to fetch anime detail:", err);
    return null;
  }
}

export async function getMangaDetail(id: number): Promise<MangaDetail | null> {
  const key = `mangaDetail_${id}`;
  if (cache[key]) return cache[key];

  try {
    const res = await fetchWithRetry(`https://api.jikan.moe/v4/manga/${id}/full`);
    const manga = res.data;
    const detail: MangaDetail = {
      mal_id: manga.mal_id,
      title: manga.title,
      title_english: manga.title_english,
      title_japanese: manga.title_japanese,
      images: manga.images,
      score: manga.score,
      rank: manga.rank,
      popularity: manga.popularity,
      chapters: manga.chapters,
      volumes: manga.volumes,
      status: manga.status,
      published: { from: manga.published?.from, to: manga.published?.to },
      synopsis: manga.synopsis,
      authors: manga.authors?.map((a: any) => ({ mal_id: a.mal_id, name: a.name, url: a.url })),
      genres: manga.genres?.map((g: any) => ({ mal_id: g.mal_id, name: g.name })),
    };
    cache[key] = detail;
    return detail;
  } catch (err) {
    console.error("Failed to fetch manga detail:", err);
    return null;
  }
}