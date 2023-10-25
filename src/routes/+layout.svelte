<script>
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });
</script>

<main>
	Nothing to Show
	<a href="/auth/login">login</a>
</main>
<!-- <main>
	<slot />
</main> -->
