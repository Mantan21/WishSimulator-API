import { json } from '@sveltejs/kit';
import ytdl from 'ytdl-core';

/** @type {import('./$types').RequestHandler} */
export function GET() {
	return json({ message: 'nothing to show' }, { status: 400 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	try {
		const { videoID } = await request.json();
		const vID = videoID?.replace(/[^A-Za-z0-9_\\-]/g, '');
		if (!vID) return json({ message: 'please input video ID' }, { status: 400 });

		// const formdata = new FormData();
		// formdata.append('link', `https://www.youtube.com/watch?v=${vID}`);
		// formdata.append('s', '9');

		// const requestOptions = {
		// 	method: 'POST',
		// 	body: formdata
		// };

		// const data = await fetch('https://mp3youtube.cc/api/converter', requestOptions);
		// const videoResult = await data.json();

		const videoResult = await ytdlLib(vID);
		return json({ message: 'ok', ...videoResult }, { status: 200 });
	} catch (e) {
		return json({ message: 'Server Error' }, { status: 500, statusText: 'server error' });
	}
}

const ytdlLib = async (/** @type {string} */ vID) => {
	const formats = { mime: '' };
	const ytInfo = await ytdl.getInfo(vID);
	ytInfo.formats
		.filter((file) => file.mimeType?.startsWith('audio'))
		.forEach((file) => {
			const mime = file.mimeType?.split(';')[0];
			// @ts-ignore
			formats[mime] = file.url;
		});

	// @ts-ignore
	const images = ytInfo.player_response.videoDetails.thumbnail.thumbnails;

	const result = {
		download: ytdl.chooseFormat(ytInfo.formats, { filter: 'audioonly' }).url,
		formats,
		author: ytInfo.videoDetails.author.name,
		title: ytInfo.videoDetails.title,
		description: ytInfo.videoDetails.description,
		images
	};

	return result;
};
