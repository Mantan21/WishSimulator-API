const list = [
	// '193.38.244.17:3128',
];

const index = Math.floor(Math.random() * list.length);
export const myProxy = 'http://' + list[index];

export const getProxy = async () => {
	const raw = await fetch('https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt');
	const proxies = await raw.text();
	const list = proxies.split('\n');
	const index = Math.floor(Math.random() * list.length);
	return 'http://' + list[index];
};

export const proxyScrape = async () => {
	const data = await fetch(
		'https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&protocol=http&proxy_format=protocolipport&format=json&timeout=20000'
	);
	const { proxies: list } = await data.json();
	const filtered = list.filter(({ alive }) => alive);
	const result = filtered.map(({ proxy }) => proxy);
	// return result
	return [''];
};
