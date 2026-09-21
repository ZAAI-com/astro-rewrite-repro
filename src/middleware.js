// Serves a Markdown-friendly alias: /about.md renders the same page as /about/.
export const onRequest = (context, next) => {
	const match = context.url.pathname.match(/^\/(.+)\.md$/);
	if (match) return context.rewrite(`/${match[1]}/`);
	return next();
};
