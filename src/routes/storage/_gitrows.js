import { GITHUB_TOKEN } from '$lib/env';
import Gitrows from 'gitrows';

const options = {
	user: 'DBManager',
	token: GITHUB_TOKEN,
	branch: 'master',
	message: 'DB Manager API Post',
	author: { name: 'DBManager', email: 'db@wishsimulator.app' }
};

const gitrows = new Gitrows(options);
export default gitrows;

export const randomNumber = (/** @type {number} */ min, /** @type {number} */ max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * @param {string} app
 * @param {number|string|unknown} db
 */
export const pathTo = (app, db = 1) => {
	const path = `@github/Mantan21/wishsim-db/${app}`;
	if (db === 'summary') return `${path}/summary.json`;
	return `${path}/db${db}.json`;
};

export const readAll = async (/** @type {string} */ app) => {
	const summaryPath = pathTo(app, 'summary');
	const dbs = (await gitrows.get(summaryPath)) || [];
	const dbNumber = Object.keys(dbs[0]).length;

	/**
	 * @type {{ db: number; }[]}
	 */
	let list = [];
	for (let i = 1; i < dbNumber + 1; i++) {
		const data = (await gitrows.get(pathTo(app, i), {}, 'pull')) || [];
		data.forEach((/** @type {{ db: number; }} */ dt) => {
			dt.db = i;
			list.push(dt);
		});
	}

	return list;
};

export const chooseDB = async (/** @type {string} */ app) => {
	const summaryPath = pathTo(app, 'summary');
	const dbs = (await gitrows.get(summaryPath)) || [];
	const dbIDs = Object.values(dbs[0]) || 0;

	// check if all db are full
	const sum = dbIDs.reduce((acc = 0, curr = 0) => parseInt(acc) + parseInt(curr), 0);
	const isFull = sum % 1000 === 0;
	if (isFull) return { dbID: dbIDs.length + 1, isNew: false, length: 0 };

	// Choose the least db
	const minVal = Math.min(...dbIDs);
	return { dbID: dbIDs.indexOf(minVal) + 1, isNew: true, length: minVal };
};

/**
 * Update Summary
 * @param {string} app
 * @param {{ dbID: number; length: number; }} data
 */
export const updateSummary = async (app, data) => {
	const { dbID, length } = data;
	const dbs = {};
	// @ts-ignore
	dbs[dbID] = length;
	const update = await gitrows.update(pathTo(app, 'summary'), dbs);
	return update;
};
