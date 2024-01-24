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

export const pathTo = (/** @type {string} */ app) => {
	const appname = app?.trim().toLocaleLowerCase();
	return `@github/Mantan21/wishsim-db/${appname}.json`;
};

export const checkApp = (/** @type {string} */ app) => {
	const appname = app?.trim().toLocaleLowerCase();
	return ['hsr', 'genshin'].includes(appname);
};
