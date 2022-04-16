import axios from 'axios';
import { GistPromptInfo } from '../types';
import { cli } from '../utils';

export class Gist {
	clientId: string;
	request_headers = {
		accept: 'application/json',
		'content-type': 'application/json'
	};

	constructor(clientId: string) {
		this.clientId = clientId;
	}

	async getInformationForPrompt() {
		const { data } = await axios('https://github.com/login/device/code', {
			method: 'POST',
			data: {
				client_id: this.clientId,
				scope: 'gist'
			},
			headers: {
				accept: 'application/json',
				'content-type': 'application/json'
			}
		});

		return data as GistPromptInfo;
	}

	waitForAuth(deviceCode: string, intervalMs: number) {
		return new Promise<string>(async (resolve, reject) => {
			while (true) {
				await cli.wait(intervalMs);

				const { data } = await axios('https://github.com/login/oauth/access_token', {
					method: 'POST',
					data: {
						device_code: deviceCode,
						client_id: this.clientId,
						grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
					},
					headers: {
						accept: 'application/json',
						'content-type': 'application/json'
					}
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
}
