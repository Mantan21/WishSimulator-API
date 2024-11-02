export const getThumbnail = (vid) => {
	return [
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
};
