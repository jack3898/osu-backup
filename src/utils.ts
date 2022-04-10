import fs from 'fs';
import { promisify } from 'util';

export const readDir = promisify(fs.readdir);

export const fileExists = fs.existsSync;

export const writeFile = promisify(fs.writeFile);

export const readFile = promisify(fs.readFile);
