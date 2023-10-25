import { CLIENT_ID } from '$lib/env';
import { redirect } from '@sveltejs/kit';

// access - refresh
// zBS-MZjHFjb7_IcFwukNceZh_U6M6B26GnxcWKqFwjQ bNaRJ93CAzDx3YuG3yu0wZHNFeMNUTb-3CBht00sf3Q

const returnURL = (/** @type {string} */ app) => {
	const returnApp = `https://api.wishsimulator.app/auth/${app}`;
	const url = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&state=chill&redirect_uri=${returnApp}`;
	return url;
};

/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	const url = new URL(request.url);
	const param = url.searchParams.get('app')?.toLocaleLowerCase();

	const app = param != 'hsr' ? 'genshin' : 'hsr';
	const appURL = returnURL(app);
	throw redirect(301, appURL);
}
