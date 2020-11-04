import { NowRequest, NowResponse } from "@vercel/node";
import { decode } from "querystring";
import { topArtist } from "../utils/spotify";
import { renderArtist } from "../utils/render";

export default async function (req: NowRequest, res: NowResponse) {
  const params = decode(req.url.split("?")[1]) as any;

  const {
    item = {}
  } = await topArtist(params.timeRange || 'short_term');

  if (params && typeof params.open !== "undefined") {
    if (item && item.external_urls) {
      res.writeHead(302, {
        Location: item.external_urls.spotify,
      });
      return res.end();
    }
    return res.status(200).end();
  }

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");

  const text = await renderArtist(item);

  return res.status(200).send(text);
}
