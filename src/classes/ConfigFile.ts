import { isEqual } from 'lodash';
import { resolve } from 'path';
import { ConfigFileProps } from '../types';
import { fileExists, readFile, writeFile } from '../utils';

export class ConfigFile {
	readonly fileName: string;
	readonly fileLocation: string;
	private config: Partial<Record<keyof ConfigFileProps, string>> = {};

	private constructor(name = 'config.json') {
		this.fileName = name;
		this.fileLocation = resolve(this.fileName);
	}

	static async init(name = 'config.json') {
		const instance = new this(name);
		const configExists = fileExists(instance.fileLocation);

		if (!configExists) await writeFile(instance.fileLocation, JSON.stringify({}));
		instance.config = await instance.fetchConfig();

		return instance;
	}

	async fetchConfig() {
		const buffer = await readFile(this.fileLocation);
		return JSON.parse(buffer.toString());
	}

	async reset() {
		this.config = await this.fetchConfig();
	}

	addProperty(key: keyof ConfigFileProps, value: string, force = false) {
		if (force) {
			this.config[key] = value;
		} else if (this.config[key] === undefined) this.config[key] = value;
	}

	getProperty(key: keyof ConfigFileProps) {
		return this.config[key];
	}

	getAllProperties() {
		return this.config;
	}

	hasProperty(key: keyof ConfigFileProps) {
		return !!this.config[key];
	}

	async apply() {
		const currentFile = await this.fetchConfig();
		const equal = isEqual(Object.values(currentFile), Object.values(this.config));

		if (!equal) return writeFile(this.fileLocation, JSON.stringify(this.config, null, '\t'));
	}
}
