import { json } from '@sveltejs/kit';
import gitrows from './_gitrows';

const randomNumber = (/** @type {number} */ min, /** @type {number} */ max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const pathTo = (/** @type {string} */ app) => {
	const appname = app?.trim().toLocaleLowerCase();
	return `@github/Mantan21/wishsim-db/${appname}.json`;
};

const checkApp = (/** @type {string} */ app) => {
	const appname = app?.trim().toLocaleLowerCase();
	return ['hsr', 'genshin'].includes(appname);
};

// Read Data Storage
/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	try {
		const url = new URL(request.url);
		const app = url.searchParams.get('app') || 'genshin';
		const id = url.searchParams.get('id');

		if (!checkApp(app)) {
			return json({ message: 'Invalid App Storage', success: false }, { status: 400 });
		}

		// Find a specific ID
		if (id) {
			const data = await gitrows.get(pathTo(app), { id });
			if (data.length < 1) return json({ message: 'Not Found', success: false });
			return json({ message: 'ok', success: true, data: data[0] });
		}

		// Show All
		const path = pathTo(app);
		const data = (await gitrows.get(path)) || [];
		return json({ message: 'ok', success: true, data });
	} catch (e) {
		return json(
			{ message: 'Server Error', success: false },
			{ status: 500, statusText: 'server error' }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { app, action, data, id } = await request.json();
		if (!checkApp(app)) {
			return json({ message: 'Invalid App Storage', success: false }, { status: 400 });
		}

		if (action === 'put') return addOrUpdate(data, app, id);
		if (action === 'delete') return deleteData(app, id);

		return json(
			{ message: 'Forbidden Action', success: false },
			{ status: 403, statusText: 'forbidden' }
		);
	} catch (e) {
		return json(
			{ message: 'Server Error', success: false },
			{ status: 500, statusText: 'server error' }
		);
	}
}

// Add or Update Data
const addOrUpdate = async (
	/** @type {object} */ data = {},
	/** @type {string} */ app,
	/** @type {number} */ id
) => {
	try {
		const checkID = !id ? [] : await gitrows.get(pathTo(app), { id });

		// Create new Object if no id
		if (!id || checkID.length < 1) {
			const rng = randomNumber(111111111, 999999999);
			const dataToStore = [{ id: rng, ...data }];
			const { message, code } = await gitrows.put(pathTo(app), dataToStore);
			return json({ message: message.description, id: rng, success: true }, { status: code });
		}

		// Update current data
		const filter = { id };
		const { message, code } = await gitrows.update(pathTo(app), data, filter);
		return json({ message: message.description, success: true, id }, { status: code });
	} catch (e) {
		return json(
			{ message: 'Failed to Update Data', success: false },
			{ status: 500, statusText: 'server error' }
		);
	}
};

// Delete Data
const deleteData = async (/** @type {string} */ app, /** @type {number} */ id) => {
	if (!id) return json({ message: 'Invalid ID' }, { status: 400 });

	const checkID = await gitrows.get(pathTo(app), { id });
	if (checkID.length < 1) return json({ message: 'ok', success: true }, { status: 201 });

	// Remove Item
	const { message } = await gitrows.delete(pathTo(app), { id });
	return json({ message: message.description, success: true }, { status: 201 });
};
