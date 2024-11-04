import { getThumbnail } from './fn/manual-thumbnails';

export const cnvmp3 = async (vid, type, fetch) => {
	const body = JSON.stringify({
		url: 'https://www.youtube.com/watch?v=' + vid,
		downloadMode: type === 'audio' ? 'audio' : 'auto',
		filenameStyle: 'basic',
		audioBitrate: '96'
	});

	const headers = new Headers();
	headers.append('Origin', 'https://cnvmp3.com/');
	headers.append('Referer', 'https://cnvmp3.com/');

	const response = await fetch('https://cnvmp3.com/fetch.php', {
		method: 'POST',
		body,
		headers
	});

	const { url, filename } = await response.json();
	const formats = {};
	const mime = type === 'video' ? 'video/mp4' : 'audio/mp3';
	formats[mime] = url;

	const result = {
		title: filename,
		images: getThumbnail(vid),
		download: url,
		provider: 'cnvmp3',
		formats
	};

	return result;
};
