import { resolve } from 'path';
import { env } from 'process';
import { ConfigFile } from '../classes/ConfigFile';
import { OsuFs } from '../classes/OsuFs';
import { cli, writeFile } from '../utils';

export default async function backup(config: ConfigFile) {
	cli.clear();

	const { osuDir, backupLocation } = config.getAllProperties();

	const location =
		osuDir ||
		(await cli.ask('Where is Osu! installed?', resolve(env.LOCALAPPDATA as string, 'osu!')));

	cli.clear();

	const osuFs = new OsuFs(location);
	const songIds = await osuFs.fetchBeatmapIds();
	const json = JSON.stringify(songIds);

	const output =
		backupLocation ||
		(await cli.ask(
			'And where would you like to store your backup file?',
			resolve(env.LOCALAPPDATA as string, 'osu!', 'backup.json')
		));

	await writeFile(resolve(output), json);

	cli.clear();

	cli.writeSuccess(`Successfully backed up ${songIds.length} songs!`);
}
