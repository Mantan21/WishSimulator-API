import { getContents } from './cors';
import { getProfile } from './profile';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params }) {
	const url = new URL(request.url);
	const profile = url.searchParams.get('profile');
	const targetURL = url.searchParams.get('u');

	if (profile) return await getProfile(profile);
	return await getContents(targetURL);
}
