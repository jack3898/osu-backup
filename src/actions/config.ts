import { resolve } from 'path';
import { env } from 'process';
import { ConfigFile } from '../classes/ConfigFile';
import { Gist } from '../classes/Gist';
import { cli } from '../utils';

export default async function restore(config: ConfigFile) {
	cli.writeLine(
		'You will be asked questions so you are never asked again when using this backup utility.'
	);

	cli.writeLine("You may type 'skip' to skip the answer.");

	await config.reset();

	/**
	 * QUESTION 1
	 */

	const osuDir = await cli.ask(
		'Where is your osu installation?',
		resolve(env.LOCALAPPDATA as string, 'osu!')
	);

	cli.clear();

	if (osuDir !== 'skip') config.addProperty('osuDir', osuDir, true);
	else cli.writeWarning('Skipped...');

	/**
	 * QUESTION 2
	 */

	const backupLocation = await cli.ask(
		'Where is your backup file? You must include the file name.',
		resolve(env.LOCALAPPDATA as string, 'osu!', 'backup.json')
	);

	cli.clear();

	if (backupLocation !== 'skip') config.addProperty('backupLocation', backupLocation, true);
	else cli.writeWarning('Skipped...');

	/**
	 * QUESTION 3
	 */

	const startRestoreStraightAway = await cli.option(
		'When restoring, would you like to run it without confirmation?',
		['n', 'y', 'skip' as const]
	);

	cli.clear();

	if (startRestoreStraightAway !== 'skip')
		config.addProperty('noCheckRestore', startRestoreStraightAway || 'n', true);
	else cli.writeWarning('Skipped...');

	/**
	 * QUESTION 4
	 */

	if (
		config.hasProperty('osuDir') &&
		config.hasProperty('backupLocation') &&
		config.getProperty('noCheckRestore') === 'y'
	) {
		const defaultAction = await cli.option(
			'It seems you have provided enough information for this utility to become self-sufficient.\n' +
				'Would you like to just run a default action on launch? WARNING: You cannot access the cli until you remove the option from the config file.',
			['backup', 'restore', 'skip' as const]
		);

		const optionValid = defaultAction === 'backup' || defaultAction === 'restore';

		cli.clear();

		if (defaultAction !== 'skip' && optionValid)
			config.addProperty('defaultAction', defaultAction, true);
	} else {
		cli.clear();
		cli.writeWarning('Skipped...');
	}

	/**
	 * QUESTION 5
	 * Setting up GitHub Gist
	 */

	const setupGist = await cli.option('Would you like to set up cloud backups to GitHub Gist?', [
		'y',
		'n',
		'skip'
	] as const);

	if (setupGist === 'y') {
		cli.writeLine(
			'This process will guide you through authorising this app to manage a GitHub Gist backup on your behalf.\n' +
				'When you next run your backup, the backup will be stored locally in addition to being uploaded to GitHub Gist.\n' +
				'WARNING: Cloud backup storage functionality has not yet been added! This only authorises this app.'
		);

		const gistClientId = config.addProperty('gistClientId', '4ed541704e2984314e8a');
		const gistApi = new Gist(gistClientId);
		const promptData = await gistApi.getInformationForPrompt();

		cli.writeLine('Your browser will open.\nSign in to GitHub, and insert the following code:');
		cli.writeWarning(promptData.user_code);

		await cli.wait(2000);

		cli.run('https://github.com/login/device');
		cli.writeLine('Waiting for authorisation...');

		const accessToken = await gistApi.waitForAuth(
			promptData.device_code,
			promptData.interval * 1000
		);

		config.addProperty('gistAccessToken', accessToken, true);

		cli.clear();
		cli.writeSuccess('Successfully authorised GitHub Gist!');
	} else {
		cli.clear();
		cli.writeWarning('Skipped...');
	}

	/**
	 * CONFIRMATION OF CHANGES
	 */

	const applyChanges = await cli.option('Would you like to save your changes?', [
		'y',
		'n'
	] as const);

	cli.clear();

	if (applyChanges === 'y') {
		await config.apply();

		cli.writeSuccess('Config options saved!');
	} else {
		await config.reset();

		cli.writeWarning('Config file not saved.');
	}
}
