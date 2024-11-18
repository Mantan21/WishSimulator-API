import { json } from '@sveltejs/kit';
import { submagic } from './providers/submagic';
import { freemake } from './providers/freemake';
import { transkriptor } from './providers/transkriptor';
import { cnvmp3 } from './providers/cnvmp3';
import { yt5s } from './providers/yt5s';
import { onedmp3 } from './providers/1dmp3';
import { mediamister } from './providers/mediamister';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return json({ message: 'nothing to show' }, { status: 400 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, fetch }) {
	try {
		const { videoID, type = 'audio' } = await request.json();
		const vid = videoID?.replace(/[^A-Za-z0-9_\\-]/g, '');
		if (!vid) return json({ message: 'please input video ID' }, { status: 400 });

		const result = await proccessYT(vid, type, fetch);
		return json({ message: 'ok', ...result }, { status: 200 });
	} catch (e) {
		console.log(e);
		return json({ message: 'Server Error' }, { status: 500, statusText: 'internal_server_error' });
	}
}

const proccessYT = (vid, type, fetch) => {
	const videoProvider = [cnvmp3, submagic, freemake, transkriptor, mediamister, yt5s, onedmp3];
	const audioProvider = [cnvmp3, submagic, freemake];
	const provider = type !== 'audio' ? videoProvider : audioProvider;
	const ytFn = provider[Math.floor(Math.random() * provider.length)];
	return ytFn(vid, type, fetch);
};
