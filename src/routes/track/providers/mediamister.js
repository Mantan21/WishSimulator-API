import { getThumbnail } from './fn/manual-thumbnails';

// mediamister.com
export const mediamister = async (vid, type, fetch) => {
	const response = await fetch('https://www.mediamister.com/get_youtube_video', {
		headers: {
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		Origin: 'https://www.mediamister.com',
		referrer: 'https://www.mediamister.com/youtube-video-downloader',
		body: 'url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + vid,
		method: 'POST'
	});

	const raw = await response.text();
	const url = parser(raw);
	return {
		title: '',
		images: getThumbnail(vid),
		download: url,
		provider: 'mediamister',
		formats: {
			'video/mp4': url
		}
	};
};

const parser = (raw) => {
	const list = raw.split('fa-volume');
	const filtered = list.findLast((a) => a.substring(a.length - 25).match(/(360)/));
	const match = filtered.match(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/);
	const link = match.find((l) => /^https:\/\/r/.test(l));
	return link;
};
