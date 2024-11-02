import { getThumbnail } from './manual-thumbnails';

// https://submagic.co/
export const submagic = async (vid, choosenType, fetch) => {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Origin', 'https://submagic-free-tools.fly.dev');
	const raw = JSON.stringify({ url: 'https://www.youtube.com/watch?v=' + vid });
	const data = await fetch('https://submagic-free-tools.fly.dev/api/youtube-info', {
		method: 'POST',
		headers: myHeaders,
		body: raw
	});

	const images = getThumbnail(vid);
	const { formats, title } = await data.json();
	const proccessed = getDownloadLink(formats, choosenType);

	return { title, images, provider: 'submagic', ...proccessed };
};

const getURL = (arr = [], t) => {
	if (t === 'audio') return (arr[arr.length - 1] || {}).url;
	const filter = arr.find(({ quality }) => quality === '360p');
	const { url = '' } = filter || {};
	return url;
};

const getDownloadLink = (formats, choosenType) => {
	const t = choosenType === 'audio' ? 'audio' : 'video_only';
	const filtered = formats.filter(({ type: vType }) => vType === t);
	const mp4 = filtered.filter(({ mimeType }) => mimeType.match(new RegExp(`${choosenType}/mp4`)));
	const webm = filtered.filter(({ mimeType }) => mimeType.match(new RegExp(`${choosenType}/webm`)));

	const links = {};
	links[`${choosenType}/mp4`] = getURL(mp4, choosenType);
	links[`${choosenType}/webm`] = getURL(webm, choosenType);

	const result = {
		download: getURL(mp4, choosenType),
		formats: links
	};

	return result;
};
