import { renderToString } from "react-dom/server";
import { Track } from "../components/Track";
import { Artist } from "../components/Artist";

export async function renderTrack(item) {
    const { name: track } = item;
    const { images = [] } = item.album || {};

    const cover = images[images.length - 1]?.url;
    let coverImg = null;
    if (cover) {
        const buff = await (await fetch(cover)).arrayBuffer();
        coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
    }

    const artist = (item.artists || []).map(({ name }) => name).join(", ");

    return renderToString(
        Track({ cover: coverImg, artist, track })
    );
}

export async function renderArtist(item) {
    const { name: artist } = item;
    const { images = [] } = item;
    const { genres = [] } = item;

    const genreString = genres[0];

    const cover = images[images.length - 1]?.url;
    let coverImg = null;
    if (cover) {
        const buff = await (await fetch(cover)).arrayBuffer();
        coverImg = `data:image/jpeg;base64,${Buffer.from(buff).toString("base64")}`;
    }

    return renderToString(
        Artist({ cover: coverImg, artist, genres: genreString })
    );
}