import { json } from '@sveltejs/kit';
import { removeOldData } from './_removeOldData';
import gitrows, { chooseDB, pathTo, randomNumber, readAll, updateSummary } from './_gitrows';

// Read Data Storage
/** @type {import('./$types').RequestHandler} */
export async function GET({ request }) {
	try {
		const url = new URL(request.url);
		const app = url.searchParams.get('app') || 'genshin';
		const idParam = url.searchParams.get('id') || '';
		const appname = app?.trim().toLocaleLowerCase();
		const validApp = ['hsr', 'genshin'].includes(appname);

		if (!validApp) {
			return json({ message: 'Invalid App Storage', success: false }, { status: 400 });
		}

		// Filter Valid ID only
		const ids = idParam.split(',').filter((id) => {
			const trimmed = parseInt(id.trim());
			return trimmed && !isNaN(trimmed);
		});

		// Check if ids are provided but invalid
		if (idParam && ids.length < 1) {
			return json({ message: 'Invalid ID', success: false });
		}

		const dataObj = await readAll(app);
		const data = await removeOldData(app, dataObj);

		// show multiple ids
		if (ids.length > 0) {
			const idNum = ids.map((id) => parseInt(id));
			const filtered = data.filter(({ id = 0 }) => idNum.includes(id));
			if (filtered.length < 1) return json({ message: 'Not Found', success: false });
			return json({ message: 'ok', success: true, data: filtered });
		}

		// Show All
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
		const appname = app?.trim().toLocaleLowerCase();
		const validApp = ['hsr', 'genshin'].includes(appname);
		if (!validApp) {
			return json({ message: 'Invalid App Storage', success: false }, { status: 400 });
		}

		if (action === 'block') return blockID(app, id, data.db);
		if (action === 'put') return addOrUpdate(app, id, data);
		if (action === 'delete') return deleteData(app, id, data.db);

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

/**
 * Add or Update Data
 * @param {string} app - App to update (Genshin or HSR)
 * @param {number} id - ID of the Object.
 * @param {object} data - Banner Data.
 */
const addOrUpdate = async (app, id, data = {}) => {
	const check = async (k = '') => {
		// @ts-ignore
		const db = await gitrows.get(pathTo(app, data.db), { id });
		if (k === 'length') return db.length < 1;
		return db[0];
	};

	try {
		const isNew = !id || !('db' in data) || (await check('length'));
		if (isNew) {
			const { dbID, length } = await chooseDB(app);
			const rng = randomNumber(111111111, 999999999);
			const dataToStore = [{ id: rng, ...data, db: dbID }];
			const { message, code } = await gitrows.put(pathTo(app, dbID), dataToStore);
			await updateSummary(app, { dbID, length: length + 1 });
			return json(
				{ message: message.description, id: rng, db: dbID, success: true },
				{ status: code }
			);
		}

		// Update current data
		const filter = { id };
		const { db } = data;
		const { message, code } = await gitrows.update(pathTo(app, db), data, filter);
		return json({ message: message.description, success: true, id, db }, { status: code });
	} catch (e) {
		return json(
			{ message: 'Failed to Update Data', success: false },
			{ status: 500, statusText: 'server error' }
		);
	}
};

/**
 * Delete Data
 * @param {string} app - App to update (Genshin or HSR)
 * @param {number} id - ID of the Object.
 * @param {number} db - Database ID
 */
const deleteData = async (app, id, db) => {
	if (!id || !db) return json({ message: 'Invalid ID' }, { status: 400 });

	// Remove Item
	const { message } = await gitrows.delete(pathTo(app, db), { id });
	const summary = await gitrows.get(pathTo(app, 'summary'), {}, 'pull');
	updateSummary(app, { dbID: db, length: summary[0][db] - 1 });
	return json({ message: message?.description, success: true }, { status: 201 });
};

/**
 * Block Banner
 * @param {string} app - App to update (Genshin or HSR)
 * @param {number} id - ID of the Object.
 * @param {number} db - Database ID
 */
const blockID = async (app, id, db) => {
	const data = !id || !db ? [] : await gitrows.get(pathTo(app, db), { id });

	if (data.length > 0) {
		const filter = { id };
		await gitrows.update(pathTo(app, db), { ...data[0], blocked: true }, filter);
	}
	return json({ message: 'Banner Blocked', success: true }, { status: 201 });
};
