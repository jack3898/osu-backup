import { resolve } from 'path';
import { fileExists, readDir, readFile } from '../utils';

export class OsuFs {
	path: string;
	songPath: string;

	constructor(rootPath: string) {
		this.path = this.verifyPath([rootPath]);
		this.songPath = this.verifyPath([this.path, 'Songs']);
	}

	private verifyPath(segments: string[] = []) {
		const path = resolve(...segments);
		const verified = fileExists(path);

		if (verified) return path;
		else throw Error('Invalid path supplied.');
	}

	songDirs() {
		return readDir(this.songPath);
	}

	async openedSongDirs() {
		const dirNames = await this.songDirs();
		const paths = dirNames.map(async dirName => {
			const fileNames = await readDir(resolve(this.songPath, dirName));
			return fileNames.map(fileName => resolve(this.songPath, dirName, fileName));
		});

		const settled = await Promise.allSettled(paths);

		return settled
			.map(outcome => {
				if (outcome.status === 'fulfilled') return outcome.value;
				else return null;
			})
			.filter(Boolean) as string[][];
	}

	async fetchBeatmapIds() {
		const songDirs = await this.openedSongDirs();
		const osuFilePaths = songDirs
			.map(songDir => songDir.find(item => item.endsWith('.osu')))
			.filter(Boolean) as string[];
		const buffers = await Promise.all(osuFilePaths.map(osuFilePath => readFile(osuFilePath)));
		const filesSplitByLine = buffers.map(buffer => buffer.toString().split('\n'));
		const beatmapConfigs = filesSplitByLine
			.map(file => {
				return file.find(line => line.includes('BeatmapID'));
			})
			.filter(Boolean) as string[];

		return beatmapConfigs.map(configLine => configLine.split(':')[1].replace(/[^0-9.]/g, ''));
	}
}
