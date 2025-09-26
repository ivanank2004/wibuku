// api.ts
const API_BASE = process.env.REACT_APP_API_URL || "https://api.jikan.moe/v4";

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

const cache: Record<string, any> = {};

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

async function cachedFetch(key: string, url: string, limit?: number): Promise<any> {
  if (cache[key]) return cache[key];
  const data = await fetchWithRetry(url);
  const result = limit ? data.data.slice(0, limit) : data.data;
  cache[key] = result;
  return result;
}

export async function getTopAnime(limit = 5): Promise<Media[]> {
  try {
    const data = await cachedFetch("topAnime", `${API_BASE}/top/anime?limit=${limit}`, limit);
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
    const data = await cachedFetch("upcomingAnime", `${API_BASE}/seasons/upcoming`, limit);
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
    const data = await cachedFetch("currentlyAiring", `${API_BASE}/seasons/now`, limit);
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
    const data = await cachedFetch("topManga", `${API_BASE}/top/manga?limit=${limit}`, limit);
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
    const res = await fetchWithRetry(`${API_BASE}/anime/${id}/full`);
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
    const res = await fetchWithRetry(`${API_BASE}/manga/${id}/full`);
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

export async function getAnimeList(
  page = 1,
  q = "",
  genre?: string,
  status?: string,
  orderBy: string = "score",
  sort: string = "desc"
): Promise<{
  data: Media[];
  last_page: number;
}> {
  const key = `animeList_${page}_${q}_${genre ?? ""}_${status ?? ""}_${orderBy}_${sort}`;
  if (cache[key]) return cache[key];

  const params = new URLSearchParams({
    page: String(page),
    order_by: orderBy,
    sort,
  });
  if (q) params.append("q", q);
  if (genre) params.append("genres", genre);
  if (status) params.append("status", status);

  const url = `${API_BASE}/anime?${params.toString()}`;
  const res = await fetchWithRetry(url);

  const result = {
    data: res.data.map((a: any) => ({
      mal_id: a.mal_id,
      title: a.title,
      images: a.images,
      score: a.score,
      status: a.status,
    })),
    last_page: res.pagination?.last_visible_page ?? 1,
  };

  cache[key] = result;
  return result;
}

export async function getMangaList(
  page = 1,
  q = "",
  genre?: string,
  status?: string,
  orderBy: string = "score",
  sort: string = "desc"
): Promise<{
  data: Media[];
  last_page: number;
}> {
  const key = `mangaList_${page}_${q}_${genre ?? ""}_${status ?? ""}_${orderBy}_${sort}`;
  if (cache[key]) return cache[key];

  const params = new URLSearchParams({
    page: String(page),
    order_by: orderBy,
    sort,
  });
  if (q) params.append("q", q);
  if (genre) params.append("genres", genre);
  if (status) params.append("status", status);

  const url = `${API_BASE}/manga?${params.toString()}`;
  const res = await fetchWithRetry(url);

  const result = {
    data: res.data.map((m: any) => ({
      mal_id: m.mal_id,
      title: m.title,
      images: m.images,
      score: m.score,
      status: m.status,
    })),
    last_page: res.pagination?.last_visible_page ?? 1,
  };

  cache[key] = result;
  return result;
}
