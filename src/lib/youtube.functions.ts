import { createServerFn } from "@tanstack/react-start";
import { fetchLiveStatus } from "./youtube.server";

/**
 * Live status for the church YouTube channel.
 * Set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID as secrets to go live.
 */
export const getLiveStatus = createServerFn({ method: "GET" }).handler(async () => {
  return fetchLiveStatus(process.env["YOUTUBE_API_KEY"], process.env["YOUTUBE_CHANNEL_ID"]);
});
