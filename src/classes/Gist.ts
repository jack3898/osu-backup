import axios from 'axios';
import { Octokit } from 'octokit';
import { GistPromptInfo } from '../types';
import { cli } from '../utils';

export class Gist {
	clientId: string;
	fileName: string;
	request_headers = {
		accept: 'application/json',
		'content-type': 'application/json'
	};
	private octokit!: Octokit;

	private constructor(clientId: string, fileName = 'backup.json') {
		this.clientId = clientId;
		this.fileName = fileName;
	}

	/**
	 * Get an unauthenticated instance of the Gist helper class.
	 */
	static asBasic(clientId: string, fileName = 'backup.json') {
		const instance = new this(clientId, fileName);

		return instance as Pick<typeof instance, 'getInformationForPrompt' | 'waitForAuth'>;
	}

	/**
	 * Get a fully authenticated instance of the Gist helper class.
	 */
	static asAuthenticated(clientId: string, authToken: string, fileName = 'backup.json') {
		const instance = new this(clientId, fileName);

		instance.octokit = new Octokit({
			auth: authToken
		});

		return instance as Required<typeof instance>;
	}

	get fileIdentifier() {
		return `${this.clientId}-${this.fileName}`;
	}

	async getInformationForPrompt() {
		const body = {
			client_id: this.clientId,
			scope: 'gist'
		};

		const { data } = await axios('https://github.com/login/device/code', {
			method: 'POST',
			data: body,
			headers: this.request_headers
		});

		return data as GistPromptInfo;
	}

	waitForAuth(deviceCode: string, intervalMs: number) {
		const body = {
			device_code: deviceCode,
			client_id: this.clientId,
			grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
		};

		return new Promise<string>(async (resolve, reject) => {
			while (true) {
				await cli.wait(intervalMs);

				const { data } = await axios('https://github.com/login/oauth/access_token', {
					method: 'POST',
					data: body,
					headers: this.request_headers
				});

				if (data.access_token) {
					resolve(data.access_token);
					break;
				} else if (data.error === 'authorization_pending') {
					continue;
				} else {
					reject(data.error);
					break;
				}
			}
		});
	}

	async createBackupFile() {
		const { data } = await this.octokit.request(`POST /gists`, {
			description: 'An Osu Backup',
			files: {
				[this.fileIdentifier]: {
					content: JSON.stringify({})
				}
			}
		});

		const gistId = data.files?.[this.fileIdentifier]?.raw_url?.split('/')[4];

		if (!gistId) throw Error('Unable to create Gist ID!');

		return gistId;
	}

	async updateBackupFile(gistId: string, content: any) {
		await this.octokit.request(`POST /gists/${gistId}`, {
			description: 'An Osu Backup',
			files: {
				[this.fileIdentifier]: {
					content: JSON.stringify(content, null, ' ')
				}
			}
		});
	}
}
