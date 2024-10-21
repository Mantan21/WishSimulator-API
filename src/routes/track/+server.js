import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	return json({ message: 'nothing to show' }, { status: 400 });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { videoID, type = 'audio' } = await request.json();
		const vID = videoID?.replace(/[^A-Za-z0-9_\\-]/g, '');
		if (!vID) return json({ message: 'please input video ID' }, { status: 400 });

		const videoResult = await y2meta(vID, type);

		return json({ message: 'ok', ...videoResult }, { status: 200 });
	} catch (e) {
		console.log(e);
		return json({ message: 'Server Error' }, { status: 500, statusText: 'server error' });
	}
}

const y2meta = async (vid, type) => {
	const isVideo = type !== 'audio';
	const quality = isVideo ? '360' : '320';
	const format = isVideo ? 'mp4' : 'mp3';

	const response = await fetch('https://6fee.mmnm.store/oajax.php', {
		headers: {
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			Origin: 'https://6fee.mmnm.store'
		},
		body: `videoid=${vid}&downtype=${format}&vquality=${quality}`,
		method: 'POST'
	});

	const { url, filename } = await response.json();
	const images = [
		{
			width: 180,
			height: 320,
			url: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`
		},
		{
			width: 1280,
			height: 720,
			url: `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`
		}
	];
	return { download: url, images, title: filename };
};
