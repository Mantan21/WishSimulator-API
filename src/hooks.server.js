import { allowedHost } from '$lib/hostlist';

const checkOrigin = (/** @type {string | URL | null} */ origin) => {
	if (!origin) return false;

	const hostlist = allowedHost().join('|');
	const validDomains = new RegExp(`^(.*)?\\.?(${hostlist})(:[0-9]+)?`);
	const { hostname, port } = new URL(origin);
	if (!validDomains.test(hostname)) return false;

	const host = hostname === 'localhost' ? 'http://localhost' : `https://${hostname}`;
	const usedPort = port ? `:${port}` : '';
	const originDomain = `${host}${usedPort}`;
	return originDomain;
};

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event);
	const origin = event.request.headers.get('origin');

	// Apply CORS header for API routes
	const allowedPath = ['/track', '/patron', '/storage', '/gcsb'];
	const checkPath = allowedPath.map((pt) => event.url.pathname.startsWith(pt));
	if (checkPath.includes(true) && !/localhost/.test(event.request.url)) {
		const cors = checkOrigin(origin);
		if (!cors) {
			const jsonResponse = JSON.stringify({ message: `You're not allowed to do this action` });
			return new Response(jsonResponse, {
				status: 400,
				headers: {
					'Access-Control-Allow-Origin': 'null',
					'Content-Type': 'application/json'
				}
			});
		}

		// Required for CORS to work
		if (event.request.method === 'OPTIONS' && cors) {
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
					'Access-Control-Allow-Origin': cors,
					'Access-Control-Allow-Headers': '*'
				}
			});
		}
	}

	// Cors for JS path
	if (event.url.pathname.startsWith('/js')) {
		response.headers.append('Access-Control-Allow-Headers', '*');
		response.headers.append('Access-Control-Allow-Methods', 'GET');
	}

	response.headers.append('Access-Control-Allow-Origin', '*');
	return response;
}
