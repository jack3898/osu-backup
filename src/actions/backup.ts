import { resolve } from 'path';
import { env } from 'process';
import { ConfigFile } from '../classes/ConfigFile';
import { Gist } from '../classes/Gist';
import { OsuFs } from '../classes/OsuFs';
import { ConfigFileProps } from '../types';
import { cli, writeFile } from '../utils';

export default async function backup(config: ConfigFile) {
	cli.clear();

	const { osuDir, backupLocation, gistClientId, gistAccessToken } = config.getAllProperties();

	const location =
		osuDir ||
		(await cli.ask('Where is Osu! installed?', resolve(env.LOCALAPPDATA as string, 'osu!')));

	cli.clear();

	const osuFs = new OsuFs(location);
	const songIds = await osuFs.fetchBeatmapIds();

	cli.clear();

	const output =
		backupLocation ||
		(await cli.ask(
			'And where would you like to store your backup file?',
			resolve(env.LOCALAPPDATA as string, 'osu!', 'backup.json')
		));

	if (gistClientId && gistAccessToken) {
		const gist = Gist.asAuthenticated(gistClientId, gistAccessToken);
		const hasGistId = config.hasProperty('gistFileId');

		if (!hasGistId) {
			const newGistId = await gist.createBackupFile();

			config.addProperty('gistFileId', newGistId);

			await config.apply();
		}

		const gistId = config.getProperty('gistFileId') as string;

		const theConfig: Partial<ConfigFileProps> = {
			gistFileId: gistId
		};

		await gist.updateBackupFile(gistId, {
			config: theConfig,
			songs: songIds
		});
		cli.writeSuccess('Successfully created/updated cloud copy of backup!');
	}

	await writeFile(resolve(output), JSON.stringify(songIds));

	cli.writeSuccess(`Successfully created local copy of backup!`);
}
