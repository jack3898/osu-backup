import { createInterface } from 'readline';
import { ReadonlyUnion } from './types';

const cli = createInterface({
	input: process.stdin,
	output: process.stdout
});

export function option<A extends readonly string[]>(question: string, options: A) {
	return new Promise<ReadonlyUnion<typeof options>>(resolve => {
		const formattedOptions = options.map(option => `> ${option}`).join('\n');
		const formattedQuestion = `${question} (default: "${options[0]}")\n${formattedOptions}\n`;

		cli.question(formattedQuestion, answer => {
			if (options.find(option => option === answer)) resolve(answer);
			else resolve(options[0]);
		});
	});
}

export function ask(question: string, defaultAnswer: string) {
	return new Promise<string>(resolve => {
		const formattedQuestion = `${question} (leave blank for default: "${defaultAnswer}")\n`;

		cli.question(formattedQuestion, answer => {
			if (answer) resolve(answer);
			else resolve(defaultAnswer);
		});
	});
}

export function writeLine(text: string) {
	console.log(text + '\n');
}
