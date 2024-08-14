import { json } from '@sveltejs/kit';
import ytdl from '@distube/ytdl-core';
import { cookies } from './cookies';
import { myProxy } from './proxy';

/** @type {import('./$types').RequestHandler} */
export function GET() {
	return json({ message: 'nothing to show' }, { status: 400 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	try {
		const { videoID, type = 'audio' } = await request.json();
		const vID = videoID?.replace(/[^A-Za-z0-9_\\-]/g, '');
		if (!vID) return json({ message: 'please input video ID' }, { status: 400 });

		// const videoResult = await mp3Youtube(vID, fetch);
		const videoResult = await proccessYt(vID, type);

		return json({ message: 'ok', ...videoResult }, { status: 200 });
	} catch (e) {
		return json({ message: 'Server Error' }, { status: 500, statusText: 'server error' });
	}
}

// const mp3Youtube = async (/** @type {string} */ vID, /** @type {function} */ fetch) => {
// 	const formdata = new FormData();
// 	formdata.append('link', `https://www.youtube.com/watch?v=${vID}`);
// 	formdata.append('s', '9');

// 	const requestOptions = {
// 		method: 'POST',
// 		body: formdata
// 	};

// 	const data = await fetch('https://mp3youtube.cc/api/converter', requestOptions);
// 	const { download, title } = await data.json();
// 	const images = [
// 		{
// 			width: 180,
// 			height: 320,
// 			url: `https://img.youtube.com/vi/${vID}/mqdefault.jpg`
// 		},
// 		{
// 			width: 1280,
// 			height: 720,
// 			url: `https://img.youtube.com/vi/${vID}/maxresdefault.jpg`
// 		}
// 	];
// 	return { download, images, title };
// };

const proccessYt = async (vID, type) => {
	const agent = ytdl.createProxyAgent({ uri: myProxy }, cookies);
	const ytInfo = await ytdl.getInfo(vID, { agent });
	const ytfn = type === 'video' ? vidLib : audioLib;
	const result = await ytfn(ytInfo);
	return result;
};

const audioLib = async (ytInfo = {}) => {
	const formats = { mime: '' };

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

const vidLib = async (ytInfo = {}) => {
	const formats = { mime: '' };
	ytInfo.formats
		.filter(({ mimeType, hasAudio, qualityLabel }) => {
			return mimeType?.startsWith('video') && !hasAudio && qualityLabel === '360p';
		})
		.forEach(({ mimeType, url }) => {
			const mime = mimeType?.split(';')[0];
			// @ts-ignore
			formats[mime] = url;
		});

	// @ts-ignore
	const images = ytInfo.player_response.videoDetails.thumbnail.thumbnails;
	const result = {
		formats,
		author: ytInfo.videoDetails.author.name,
		title: ytInfo.videoDetails.title,
		description: ytInfo.videoDetails.description,
		images
	};
	return result;
};
