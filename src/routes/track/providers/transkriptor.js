import { getThumbnail } from './fn/manual-thumbnails';

// https://transkriptor.com/
// Audio Format is too slow!
export const transkriptor = async (vid, type, fetch) => {
	const body = JSON.stringify({
		url: 'https://www.youtube.com/watch?v=' + vid,
		app: 'transkriptor',
		is_only_download: true,
		is_mp3: type === 'audio'
	});
	const host = 'https://oo6o8y6la6.execute-api.eu-central-1.amazonaws.com';
	const endpoint = host + '/default/Upload-DownloadYoutubeLandingPage';
	const response = await fetch(endpoint, { body, method: 'POST' });
	const { download_url } = await response.json();

	const formats = {};
	const mime = type === 'video' ? 'video/mp4' : 'audio/mp3';
	formats[mime] = download_url;

	const result = {
		title: '',
		images: getThumbnail(vid),
		download: download_url,
		provider: 'transkriptor',
		formats
	};

	return result;
};
