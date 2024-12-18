import { getThumbnail } from './fn/manual-thumbnails';

// https://www.freemake.com
export const freemake = async (vid, choosenType, fetch) => {
	const myHeaders = new Headers();
	myHeaders.append('Origin', 'https://www.freemake.com');
	myHeaders.append('Referer', 'https://www.freemake.com/free_video_downloader_skillful');
	myHeaders.append('x-analytics-header', 'UA-18256617-1');
	const data = await fetch('https://downloader.freemake.com/api/videoinfo/' + vid, {
		headers: myHeaders
	});

	const images = getThumbnail(vid);
	const { metaInfo, qualities } = await data.json();
	const { title } = metaInfo;
	const proccessed = getDownloadLink(qualities, choosenType);

	return { title, images, provider: 'freemake', ...proccessed };
};

const getDownloadLink = (links, t) => {
	const ext = t === 'video' ? 'Mp4' : 'M4a';
	const filtered = links.filter(({ qualityInfo }) => qualityInfo.format === ext);
	const filterVideo = () => filtered.find(({ qualityInfo }) => qualityInfo.qualityLabel === '360p');
	const targetObj = t === 'audio' ? filtered[0] : filterVideo();

	const { url = '' } = targetObj || {};
	const result = {
		download: url,
		formats: { 'video/mp4': url }
	};

	return result;
};
