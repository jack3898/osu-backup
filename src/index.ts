import backup from './actions/backup';
import restore from './actions/restore';
import { Cli } from './classes/Cli';

const cli = new Cli();

async function main() {
	const answer = await cli.option('What would you like to do?', [
		'backup',
		'restore',
		'quit'
	] as const);

	cli.clear();

	switch (answer) {
		case 'backup':
			await backup(cli).catch(cli.writeError);
			break;
		case 'restore':
			await restore(cli).catch(cli.writeError);
			break;
		case 'quit':
			process.exit();
		default:
			cli.writeError('Invalid option!');
	}

	main();
}

main();

// import { spawn } from 'child_process';

// spawn('explorer.exe', ['osu://b/2870818']);
