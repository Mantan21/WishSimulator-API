const list = [
	'178.254.31.232:3128',
	'152.26.229.66:9443',
	'152.26.229.86:9443',
	'152.26.229.88:9443',
	'152.26.231.42:9443',
	'152.26.231.77:9443',
	'152.26.231.86:9443'
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
