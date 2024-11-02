import { json } from '@sveltejs/kit';
import { submagic } from './providers/submagic';

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
		return json({ message: 'Server Error' }, { status: 500, statusText: 'server error' });
	}
}

const proccessYT = (vid, type, fetch) => {
	const videoProvider = [submagic];
	const audioProvider = [submagic];
	const provider = type !== 'audio' ? videoProvider : audioProvider;
	const ytFn = provider[Math.floor(Math.random() * provider.length)];
	return ytFn(vid, type, fetch);
};
