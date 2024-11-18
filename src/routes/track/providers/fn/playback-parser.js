export const parseResult = (str) => {
	const [, grab360] = str.split('360p (.mp4)');
	const [content] = grab360.split('</tr>');
	const match = content.match(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/);
	const rawLink = match.find((l) => /^https:\/\/r/.test(l));

	const matchScript = str.match(/<script\b[^>]*>([\s\S]*?)<\/script>/);
	const rawScript = matchScript.find((str) => str.match(/nfunc/));
	const regex = /(nfunc\(a\).*(;;))/;
	const nfuncStr = JSON.stringify(rawScript).match(regex)?.[0] || 'nfunc(){}';
	const parserFnStr = `function ${JSON.parse(`{"fn": "${nfuncStr.replace(';;', '')}"}`).fn}`;
	const parserFN = eval(`(${parserFnStr})`);

	const parsedLink = fillN(rawLink, parserFN);
	return parsedLink;
};

const fillN = (url, nfunc) => {
	const urlObj = new URL(url);
	const params = new URLSearchParams(urlObj.search);

	const n = params.get('n');
	const enc_n = nfunc(n);
	params.set('n', enc_n);
	urlObj.search = params.toString();
	return urlObj.toString();
};
