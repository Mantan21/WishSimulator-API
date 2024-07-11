import { json, text } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params }) {
	const url = new URL(request.url);
	const targetURL = url.searchParams.get('u');
	const validURL = validateURL(targetURL);

	if (!validURL) return text('Invalid URL', { status: 400 });

	return await getContents(targetURL);
}

const validateURL = (url) => {
	const pattern = new RegExp(
		'^([a-zA-Z]+:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$', // fragment locator
		'i'
	);
	return pattern.test(url);
};

const getContents = async (url) => {
	const target = await fetch(url);
	const contentType = target.headers.get('content-type');
	console.log(contentType);
	if (!/(json|text|css|html|javascript)/.test(contentType)) {
		return text('Invalid Contents! Text Supported Only', { status: 400 });
	}

	const content = await target.text();
	const validJSON = isJSON(content);
	if (validJSON) return json(validJSON, { status: 200 });
	return text(content, { status: 200 });
};

const isJSON = (content) => {
	try {
		const isValid = JSON.parse(content);
		return isValid;
	} catch (e) {
		return false;
	}
};
