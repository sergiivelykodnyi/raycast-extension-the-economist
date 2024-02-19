import os from "node:os";
import { environment } from "@raycast/api";
import Parser from "rss-parser";
import { Topic } from "./types";

const parser = new Parser({
  headers: {
    "User-Agent": `Hacker News Extension, Raycast/${environment.raycastVersion} (${os.type()} ${os.release()})`,
  },
  customFields: {
    item: [["media:content", "mediaContent", { keepArray: true }]],
  },
});

export async function getFeed(topic: Topic | null): Promise<Parser.Item[]> {
  if (!topic) {
    return [];
  }

  const feed = await parser.parseURL(`https://www.economist.com/${topic}/rss.xml`);

  return feed.items ?? [];
}
