import { resolve } from 'path';
import { env } from 'process';
import { ConfigFile } from '../classes/ConfigFile';
import { cli, readFile } from '../utils';

export default async function restore(config: ConfigFile) {
	cli.clear();

	const { backupLocation, noCheckRestore } = config.getAllProperties();

	const location =
		backupLocation ||
		(await cli.ask(
			'Where is your backup file? Make sure you include the filename.',
			resolve(env.LOCALAPPDATA as string, 'osu!', 'backup.json')
		));

	cli.clear();

	const backupFileContentsRaw = await readFile(location);
	const backupFileContentsJson: string[] = JSON.parse(backupFileContentsRaw.toString());

	if (noCheckRestore !== 'y') {
		const ready = await cli.option('Backup file loaded. Are you ready to restore?', [
			'n',
			'y'
		] as const);

		cli.clear();

		if (ready !== 'y') return void cli.writeWarning(`Operation aborted! 'y' expected.`);
	}

	const urls = backupFileContentsJson.map(songId => `osu://b/${songId}`);

	cli.clear();

	cli.writeLine('Backup restore initiated! Press CTRL + C twice to cancel the restore.');

	for (const url of urls) {
		await cli.run(url);
		cli.writeLine(`Adding ${url} to the queue...`);
		await cli.wait(1000); // Rushing the Osu! client causes it to open beatmaps in the browser
	}

	cli.writeSuccess('All songs sent to Osu! successfully!');
}
