export type ReadonlyUnion<A extends readonly any[]> = A[number];

export interface ConfigFileProps {
	osuDir: string;
	backupLocation: string;
	noCheckRestore: 'y' | 'n';
	defaultAction: 'backup' | 'restore';
	gistClientId: string;
	gistAccessToken: string;
	gistFileId: string;
}

export interface GistPromptInfo {
	device_code: string;
	user_code: string;
	verification_uri: string;
	expires_in: number;
	interval: number;
}

export interface GistPoll {
	device_code: string;
	client_id: string;
	grant_type: 'urn:ietf:params:oauth:grant-type:device_code';
}
