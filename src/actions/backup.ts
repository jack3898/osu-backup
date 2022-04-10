import { resolve } from 'path';
import { env } from 'process';
import { Cli } from '../classes/Cli';
import { OsuFs } from '../classes/OsuFs';
import { writeFile } from '../utils';

export default async function backup(cli: Cli) {
	cli.clear();

	const location = await cli.ask(
		'Where is Osu! installed?',
		resolve(env.LOCALAPPDATA as string, 'osu!')
	);

	cli.clear();

	const osuFs = new OsuFs(location);
	const songIds = await osuFs.fetchBeatmapIds();
	const json = JSON.stringify(songIds);

	const output = await cli.ask(
		'And where would you like to store your backup file?',
		resolve(env.LOCALAPPDATA as string, 'osu!')
	);

	await writeFile(resolve(output, 'backup.json'), json);

	cli.clear();

	cli.writeSuccess(`Successfully backed up ${songIds.length} songs!`);
}
