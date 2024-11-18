import { getThumbnail } from './fn/manual-thumbnails';
import { parseResult } from './fn/playback-parser';

// https://1dmp3.com
export const onedmp3 = async (vid, type, fetch) => {
	const response = await fetch(
		'https://1dmp3.com/mates/en/analyze/ajax?retry=undefined&platform=youtube',
		{
			headers: {
				'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
			},
			method: 'POST',
			Origin: 'https://1dmp3.com',
			referrer: 'https://1dmp3.com/',
			body: `url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${vid}&ajax=1&lang=en`
		}
	);

	const { result, status } = await response.json();
	if (!(status === 'success' && result)) return {};

	const url = parseResult(result);
	return {
		title: '',
		images: getThumbnail(vid),
		download: url,
		provider: '1dmp3',
		formats: {
			'video/mp4': url
		}
	};
};
