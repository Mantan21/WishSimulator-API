import { text } from '@sveltejs/kit';
import { allowedHost } from '$lib/hostlist';
import placeholder from './placeholder?raw';

// Remove or change js path
// import js from './image-cdn?raw'; // UnMinified version
import js from './image-cdn.min?raw'; // minified Version

/** @type {import('./$types').RequestHandler} */
export function GET({ request }) {
	const origin = request.headers.get('origin');
	const allowed = origin?.match(new RegExp(allowedHost().join('|')));
	if (allowed) return text(js, { status: 200 });
	return text(placeholder, { status: 200 });
}
