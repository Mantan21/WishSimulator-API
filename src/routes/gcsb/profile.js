import { json, text } from '@sveltejs/kit';
import { parse } from 'csv-parse/sync';

const csvURL = 'https://gcaf-dashboard-fnonimloka-uc.a.run.app/studentData/data.csv';

export const getProfile = async (publicID) => {
	try {
		const csvResource = await fetch(csvURL);
		const csv = await csvResource.text();

		const parsedCSV = parse(csv, {
			skip_empty_lines: true,
			columns: [
				'last_update',
				'full_name',
				'email',
				'ref_code',
				'public_profile',
				'status',
				'arcade',
				'skillbadge',
				'trivia'
			]
		});

		const findProfile = parsedCSV.find(({ public_profile }) => {
			const [, recordedID] = public_profile.split('profiles/');
			return recordedID === publicID;
		});
		const errorObj = { status: 'error', msg: `No Data Recorded for "${publicID}"` };
		return json(findProfile || errorObj);
	} catch (e) {
		return json(
			{ status: 'error', msg: 'Server Error: Failed to load Resources' },
			{ status: 400 }
		);
	}
};
