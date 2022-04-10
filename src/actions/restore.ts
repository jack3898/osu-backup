import { resolve } from 'path';
import { env } from 'process';
import { ask, option, writeLine } from '../cli';
import { readFile, run, wait } from '../utils';

export default async function restore() {
	const backupLocation = await ask(
		'Where is your backup file?',
		resolve(env.LOCALAPPDATA as string, 'osu!', 'backup.json')
	);

	const backupFileContentsRaw = await readFile(backupLocation);
	const backupFileContentsJson: string[] = JSON.parse(backupFileContentsRaw.toString());
	const ready = await option('Backup file loaded. Are you ready to restore?', ['y', 'n'] as const);

	if (ready === 'n') return void writeLine('Operation aborted');

	const urls = backupFileContentsJson.map(songId => `osu://b/${songId}`);

	for (const url of urls) {
		await run(url);
		await wait(300);
	}

	writeLine('Backup successful!');
}
