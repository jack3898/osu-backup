import { spawn } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

export const readDir = promisify(fs.readdir);
export const writeFile = promisify(fs.writeFile);
export const readFile = promisify(fs.readFile);
export const run = (command: string) => {
	return new Promise(resolve => {
		const process = spawn('explorer.exe', [command]);

		process.on('exit', resolve);
	});
};
export const wait = (ms: number) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
};
