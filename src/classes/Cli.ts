import chalk from 'chalk';
import { spawn } from 'child_process';
import { createInterface, Interface } from 'readline';
import { ReadonlyUnion } from '../types';

export class Cli {
	private cli: Interface;

	constructor() {
		this.cli = createInterface({
			input: process.stdin,
			output: process.stdout
		});
	}

	args() {
		return process.argv;
	}

	option<A extends readonly string[]>(question: string, options: A) {
		return new Promise<ReadonlyUnion<typeof options> | null>(resolve => {
			const formattedOptions = options.map(option => `${chalk.blue('>')} ${option}\n`).join('');
			const formattedQuestion = `${question} (default: "${options[0]}")\n${formattedOptions}`;

			this.cli.question(formattedQuestion, answer => {
				if (options.find(option => option === answer)) resolve(answer);
				else if (answer === '') resolve(options[0]);
				else resolve(null);
			});
		});
	}

	ask(question: string, defaultAnswer: string) {
		return new Promise<string>(resolve => {
			const formattedQuestion = `${question} (leave blank for default: "${defaultAnswer}")\n`;

			this.cli.question(formattedQuestion, answer => {
				if (answer) resolve(answer);
				else resolve(defaultAnswer);
			});
		});
	}

	run = (command: string) => {
		return new Promise(resolve => {
			const process = spawn('explorer.exe', [command]);

			process.on('exit', resolve);
		});
	};

	wait = (ms: number) => {
		return new Promise(resolve => {
			setTimeout(resolve, ms);
		});
	};

	clear() {
		console.clear();
	}

	writeLine(text: string) {
		console.log(text + '\n');
	}

	writeSuccess(text: string) {
		console.log(chalk.green(text) + '\n');
	}

	writeError(text: string) {
		console.error(chalk.red(text) + '\n');
	}

	writeWarning(text: string) {
		console.warn(chalk.yellow(text) + '\n');
	}
}
