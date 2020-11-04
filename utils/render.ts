import { renderToString } from "react-dom/server";
import { Track } from "../components/Track";
import { Artist } from "../components/Artist";
import { Player } from "../components/NowPlaying";

export async function renderTrack(item) {
    const { name: track } = item;
    const { images = [] } = item.album || {};
    const { external_urls } = item;
    const { spotify: url } = external_urls;

    const cover = images[images.length - 1]?.url;
    let coverImg = null;
    if (cover) {
        const buff = await (await fetch(cover)).arrayBuffer();
        coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
    }

    const artist = (item.artists || []).map(({ name }) => name).join(", ");

    return renderToString(
        Track({ cover: coverImg, artist, track, url })
    );
}

export async function renderArtist(item) {
    const { name: artist } = item;
    const { images = [] } = item;
    const { genres = [] } = item;
    const { external_urls } = item;
    const { spotify: url } = external_urls;

    const genreString = genres[0];

    const cover = images[images.length - 1]?.url;
    let coverImg = null;
    if (cover) {
        const buff = await (await fetch(cover)).arrayBuffer();
        coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
    }

    return renderToString(
        Artist({ cover: coverImg, artist, genres: genreString, url })
    );
}

export async function renderNowPlaying(item, isPlaying, progress) {
    const { duration_ms: duration, name: track } = item;
    const { images = [] } = item.album || {};
    const { external_urls } = item;
    const { spotify: url } = external_urls;

    const cover = images[images.length - 1]?.url;
    let coverImg = null;
    if (cover) {
        const buff = await (await fetch(cover)).arrayBuffer();
        coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
    }

    const artist = (item.artists || []).map(({ name }) => name).join(", ");
    return renderToString(
        Player({ cover: coverImg, artist, track, isPlaying, progress, duration, url })
    );
}