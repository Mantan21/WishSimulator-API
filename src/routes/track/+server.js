import { json } from '@sveltejs/kit';
import { Innertube, UniversalCache } from 'youtubei.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
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
		console.log(e);
		return json({ message: 'Server Error' }, { status: 500, statusText: 'server error' });
	}
}

const proccessYt = async (vid, type) => {
	const yt = await Innertube.create({
		cache: new UniversalCache(false),
		generate_session_locally: true
	});

	const ytInfo = await yt.getBasicInfo(vid);
	const format = ytInfo.chooseFormat({ type, quality: type !== 'audio' ? '360p' : 'best' });
	const url = format?.decipher(yt.session.player);
	if (!format) throw new Error('Format Error');

	const result = {
		formats: { download: url },
		author: ytInfo.basic_info.author,
		title: ytInfo.basic_info.title,
		images: ytInfo.basic_info.thumbnail
	};

	return result;
};
