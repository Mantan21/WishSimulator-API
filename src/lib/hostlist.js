import { ALLOWED_HOST } from './env';

export const allowedHost = () => {
	const hosts = ALLOWED_HOST.split(',');
	const trimmed = hosts.map((/** @type {string} */ h) => h.trim().toLocaleLowerCase());
	const filtered = trimmed.filter((/** @type {any} */ f) => !!f);
	return [...filtered, 'localhost'];
};
