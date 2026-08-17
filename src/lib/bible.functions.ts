import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchPassage } from "./bible.server";

/**
 * Reads a scripture passage.
 * Set BIBLE_API_KEY (and optionally BIBLE_ID) as secrets to go live.
 */
export const getPassage = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ reference: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["BIBLE_API_KEY"];
    const bibleId = process.env["BIBLE_ID"] ?? "de4e12af7f28f599-02"; // KJV
    return fetchPassage(data.reference, apiKey, bibleId);
  });
