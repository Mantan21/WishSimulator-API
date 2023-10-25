import { oauth } from 'patreon';
import { CLIENT_ID, CLIENT_SECRET } from '$lib/env';

const oauthClient = oauth(CLIENT_ID, CLIENT_SECRET);

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params }) {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');

	const { app } = params;
	const appsub = app != 'hsr' ? '' : 'hsr.';
	const appDomain = `https://${appsub}wishsimulator.app`;
	const callbackuri = `https://api.wishsimulator.app/auth/${app}`;

	try {
		const { access_token, refresh_token } = await oauthClient.getTokens(code, callbackuri);
		const token = JSON.stringify({ access_token, refresh_token });
		const appURL = `${appDomain}/pro?token=${btoa(token)}`;

		return new Response(null, {
			status: 302,
			headers: { location: appURL }
		});

		// Login Failed
	} catch (e) {
		console.log(e);
		const appURL = `${appDomain}/pro?failed`;
		return new Response(null, {
			status: 302,
			headers: { location: appURL }
		});
	}
}
