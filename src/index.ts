import backup from './actions/backup';
import restore from './actions/restore';
import { option } from './cli';

(async () => {
	const answer = await option('What would you like to do?', ['backup', 'restore'] as const);

	switch (answer) {
		case 'backup':
			await backup();
			break;
		case 'restore':
			await restore();
			break;
	}
})();

// import { spawn } from 'child_process';

// spawn('explorer.exe', ['osu://b/2870818']);
