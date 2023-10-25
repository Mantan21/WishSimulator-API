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
