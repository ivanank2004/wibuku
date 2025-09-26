export interface Media {
  mal_id: number;
  title: string;
  images: {
    jpg: { image_url: string };
  };
  score: number;
  status: string;
}

export async function getTopAnime(limit: number = 5): Promise<Media[]> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data.map((anime: any) => ({
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

export async function getUpcomingAnime(limit: number = 5): Promise<Media[]> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/seasons/upcoming`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    const upcoming = data.data.slice(0, limit);
    return upcoming.map((anime: any) => ({
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

export async function getTopManga(limit: number = 5): Promise<Media[]> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/top/manga?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data.map((manga: any) => ({
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
