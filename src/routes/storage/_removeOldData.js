import gitrows, { pathTo } from './_gitrows';

/**
 * Remove Old Data
 * @param {string} app - App to update (Genshin or HSR).
 * @param {any} data - ID of the Banner.
 */
export const removeOldData = async (app, data = []) => {
	let expiredItems = 0;
	const filtered = data.filter((/** @type {any} */ d) => d !== null);

	for (let i = 0; i < filtered.length; i++) {
		const { lastModified, itemID, id, imageHash } = filtered[i] || {};
		const lastChange = new Date(lastModified).getTime();
		if (!lastModified || isNaN(lastChange)) {
			filtered[i] = deletedObj(id, itemID);
			continue;
		}

		const today = new Date().getTime();
		const timeDiff = today - lastChange;
		const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));

		// Remove if banner inactive in 30days
		if (dayDiff < 31) continue;
		expiredItems += 1;
		filtered[i] = deletedObj(id, itemID);
		deleteImages(imageHash);
	}

	if (expiredItems > 0) updateGit(app, filtered);
	return filtered;
};

/**
 * Delete Images
 * @param {number} id - ID of the object.
 * @param {number} itemID - ID of the Banner.
 */
const deletedObj = (id, itemID) => ({ id, itemID, deleted: true });

const deleteImages = async (/** @type {any} */ imageHash = {}) => {
	const keys = Object.keys(imageHash);
	for (let i = 0; i < keys.length; i++) {
		const hashID = imageHash[keys[i]];
		await deleteIBB(hashID);
	}
};

const deleteIBB = async (/** @type {any} */ hashID) => {
	const { hash, id } = hashID || {};
	if (!(hash && id)) return;

	try {
		const formdata = new FormData();
		formdata.append('action', 'delete');
		formdata.append('delete', 'image');
		formdata.append('deleting[id]', id);
		formdata.append('deleting[hash]', hash);

		const data = await fetch('https://ibb.co/json', { method: 'POST', body: formdata });
		const { status_code } = await data.json();
		console.log(id, hash, status_code);
		return status_code === 200;
	} catch (e) {
		console.error(e);
		return false;
	}
};

/**
 * Update GIT Data
 * @param {string} app - App to update (Genshin or HSR).
 * @param {any} data - ID of the Banner.
 */
const updateGit = async (app, data) => {
	try {
		const { message, code } = await gitrows.replace(pathTo(app), data);
		console.log(message.description, code);
	} catch (e) {
		console.error(e);
	}
};
