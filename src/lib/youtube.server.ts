export type LiveStatus = {
  isLive: boolean;
  videoId: string | null;
  title: string;
  configured: boolean;
};

const OFFLINE: LiveStatus = {
  isLive: false,
  videoId: null,
  title: "Sunday Celebration Service",
  configured: false,
};

/**
 * Asks the YouTube Data API whether the church channel is currently live.
 * Without credentials it reports "offline / not configured" so the page still works.
 */
export async function fetchLiveStatus(
  apiKey: string | undefined,
  channelId: string | undefined,
): Promise<LiveStatus> {
  if (!apiKey || !channelId) return OFFLINE;

  const url =
    `https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video` +
    `&channelId=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);
    const json = (await res.json()) as {
      items?: { id?: { videoId?: string }; snippet?: { title?: string } }[];
    };
    const item = json.items?.[0];
    if (!item?.id?.videoId) return { ...OFFLINE, configured: true };
    return {
      isLive: true,
      videoId: item.id.videoId,
      title: item.snippet?.title ?? OFFLINE.title,
      configured: true,
    };
  } catch {
    return { ...OFFLINE, configured: true };
  }
}
