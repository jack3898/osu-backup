import { resolve } from 'path';
import { env } from 'process';
import { ask, writeLine } from '../cli';
import { readDir, readFile, writeFile } from '../utils';

export default async function backup() {
	const location = await ask(
		'Where is Osu! installed?',
		resolve(env.APPDATA as string, '..', 'Local', 'osu!')
	);

	const songsDir = resolve(location, 'Songs');
	const songsDirs = await readDir(songsDir);

	const ids = await Promise.all(
		songsDirs.map(async songDirName => {
			try {
				const songPath = resolve(songsDir, songDirName);
				const songDirFiles = await readDir(songPath);
				const osuFileName = songDirFiles.find(fileName => fileName.endsWith('.osu')) as string;
				const contents = await readFile(resolve(songPath, osuFileName));
				const lines = contents.toString().split('\n');
				const config = lines.find(line => line.includes('BeatmapID'));
				const beatmapId = config?.split(':')[1].replace('\r', '');

				return beatmapId;
			} catch (error) {
				return;
			}
		})
	);

	const filteredIds = ids.filter(Boolean);
	const json = JSON.stringify(filteredIds);

	await writeFile(resolve(location, 'backup.json'), json);

	writeLine(`Successfully backed up ${ids.length} songs!`);
}
