import { getThumbnail } from './fn/manual-thumbnails';
import { parseResult } from './fn/playback-parser';

// https://yt5s.biz/id/
// Video only
export const yt5s = async (vid, type, fetch) => {
	const headers = new Headers();
	headers.append('content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
	const response = await fetch(
		'https://yt5s.biz/mates/en/analyze/ajax?retry=undefined&platform=youtube&mhash=b69944d4ae8b9171',
		{
			headers,
			body: 'url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + vid + '&ajax=1&lang=id',
			method: 'POST'
		}
	);

	const { result, status } = await response.json();
	if (!(status === 'success' && result)) return {};

	const url = parseResult(result);
	return {
		title: '',
		images: getThumbnail(vid),
		download: url,
		provider: 'yt5s',
		formats: {
			'video/mp4': url
		}
	};
};
