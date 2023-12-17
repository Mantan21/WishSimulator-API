/*!
 *  WishSimulator.App
 *
 *  (c) 2020-2023, Indie DevCorp
 * 	This site uses Netlify CDN services.
 *  You can just deploy the attached 'netlify.toml' file from this repository to your Netlify account.
 *  then type your url to this file
 *
 *  For more details, please visit https://docs.netlify.com/image-cdn/overview/
 * 	To Minify this code, you can use this tool => https://skalman.github.io/UglifyJS-online/
 *
 *  MIT License
 */

// @ts-nocheck
const myCDN = {
	_siteData() {
		// Change data below with your host and cdn service
		const allowedHost = ['wishsimulator.app'];
		const cdnURL = 'https://imagecdn.wishsimulator.app/';
		const placeholder = '/placeholder-cdn.webp';
		return { cdnURL, placeholder, myHost: allowedHost };
	},

	_imgPath(img = '') {
		if (!img.match(/i.ibb.co/)) return 'transform/' + img;
		const [, imgID] = img.split('ibb.co/');
		return 'cb/' + imgID;
	},

	_checkOrigin(site = null) {
		if (!site) return false;
		const { myHost } = myCDN._siteData();
		const allowedSite = site.match(new RegExp(myHost.join('|'), 'i'));
		if (!allowedSite) return false;

		const { hostname } = window.location;
		const regex = [...myHost, 'localhost'].join('|');
		const allowedHost = hostname.match(new RegExp(regex, 'i'));
		return !!allowedHost;
	},

	generateUrl(imgs, width, site) {
		if (!imgs) return null;
		const { _siteData, _checkOrigin, _imgPath } = myCDN;
		const { cdnURL, placeholder } = _siteData();
		const validOrigin = _checkOrigin(site);

		// Process String
		if (typeof imgs === 'string') {
			const w = width && !isNaN(width) ? `&w=${width}` : '';
			if (!validOrigin) return placeholder;
			return cdnURL + _imgPath(imgs) + w;
		}

		// Process Object
		if (typeof imgs !== 'object') return imgs;
		Object.keys(imgs).forEach((key) => {
			const width = key === 'faceURL' ? '&w=226' : '';
			const finalURL = cdnURL + _imgPath(imgs[key]) + width;
			imgs[key] = validOrigin ? finalURL : placeholder;
		});
		return imgs;
	}
};

(() => {
	if ('getCDNImageURL' in window) return;
	window.getCDNImageURL = myCDN.generateUrl;
})();
