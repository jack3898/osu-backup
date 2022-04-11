import backup from './actions/backup';
import runconfig from './actions/config';
import restore from './actions/restore';
import { ConfigFile } from './classes/ConfigFile';
import { cli } from './utils';

async function main() {
	const config = await ConfigFile.init();

	const action = config.getProperty('defaultAction');

	const answer =
		action ||
		(await cli.option('What would you like to do?', [
			'backup',
			'restore',
			'config',
			'quit'
		] as const));

	cli.clear();

	switch (answer) {
		case 'backup':
			await backup(config).catch(cli.writeError);
			break;
		case 'restore':
			await restore(config).catch(cli.writeError);
			break;
		case 'config':
			await runconfig(config).catch(cli.writeError);
			break;
		case 'quit':
			process.exit();
		default:
			cli.writeError('Invalid option!');
	}

	if (!config.hasProperty('defaultAction')) main();
	else {
		cli.writeLine('Exiting...');
		await cli.wait(2000);
		process.exit();
	}
}

main();

// import { spawn } from 'child_process';

// spawn('explorer.exe', ['osu://b/2870818']);
