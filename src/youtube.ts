import { SummalyPlugin } from "@misskey-dev/summaly";
import { OEmbedVideoResponse } from "./oembed";
import { HTMLRewriter } from "htmlrewriter";

async function getPlayer(response: OEmbedVideoResponse) {
    const rewriter = new HTMLRewriter()
    const {width, height} = response
    let videoUrl: string | null = null;
    rewriter.on('iframe', {
        element(element) {
            videoUrl = element.getAttribute('src')
        }
    })
    await rewriter.transform(new Response(response.html))
    return {
        url: videoUrl,
        allow: [
            "autoplay",
            "clipboard-write",
            "encrypted-media",
            "picture-in-picture",
            "web-share",
            "fullscreen"
        ],
        width,
        height,
    }
}

function isYouTubeVideoUrl(url: URL): boolean {
    if (url.hostname === 'youtu.be') {
        return /^\/[^/]+$/.test(url.pathname)
    }

    if (url.hostname !== 'www.youtube.com') {
        return false
    }

    return (
        (url.pathname === '/watch' && Boolean(url.searchParams.get('v'))) ||
        /^\/(?:shorts|live)\/[^/]+$/.test(url.pathname)
    )
}

export default {
    test: isYouTubeVideoUrl,
    async summarize(url) {
        console.log('Custom YouTube plugin is used')
        const oEmbedUrl = new URL('https://www.youtube.com/oembed')
        oEmbedUrl.searchParams.set('url', url.toString())
        oEmbedUrl.searchParams.set('format', 'json')

        const oEmbedResponse = await fetch(oEmbedUrl, {
            method: 'GET',
        })

        if (!oEmbedResponse.ok) {
            throw new Error('fetch failed')
        }

        const responseJson: OEmbedVideoResponse = await oEmbedResponse.json()
        const player = await getPlayer(responseJson)

        return {
            title: responseJson.title?.trim() || null,
            icon: 'https://www.youtube.com/s/desktop/014dbbed/img/favicon_32x32.png',
            description: '',
            thumbnail: responseJson.thumbnail_url?.trim() || null,
            sitename: 'YouTube',
            thumbnailStyle: "summary_large_image",
            activityPub: null,
            fediverseCreator: null,
            sensitive: false,
            player,
        }
    },
} satisfies SummalyPlugin;