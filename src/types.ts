export type ReadonlyUnion<A extends readonly any[]> = A[number];

export interface ConfigFileProps {
	osuDir: string;
	backupLocation: string;
	noCheckRestore: 'y' | 'n';
	defaultAction: 'backup' | 'restore';
}
