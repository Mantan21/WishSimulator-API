import { json } from '@sveltejs/kit';
import { patreon } from 'patreon';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { token } = await request.json();
		if (!token) return json({ message: 'Invalid Token' }, { status: 400 });

		const apiClient = patreon(token);
		// const x = await apiClient('/campaigns/8857793/pledges');
		const x = await apiClient('/current_user');
		console.log(x);
		// const user = store
		// 	.findAll('user')
		// 	.map((/** @type {{ serialize: () => any; }} */ user) => user.serialize());
		// const campaign = store
		// 	.findAll('campaign')
		// 	.map((/** @type {{ serialize: () => any; }} */ campaign) => campaign.serialize());

		return json({ message: 'ok', data: x.rawJson }, { status: 200 });
	} catch (e) {
		console.error(e);
		return json({ message: '' }, { status: 400 });
	}
}
