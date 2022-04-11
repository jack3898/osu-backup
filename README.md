# Osu backup

This is a simple CLI application that will help you backup and restore your beatmaps. More backup data will be added soon.

## How this application works

Before I continue I must mention you need Osu! supporter because this application takes advantage of Osu! direct. It only works on Windows.

How this works is it reads the beatmap IDs from each beatmap and stores a list of them in the backup file. Then, when you go to restore your backup, this application will summon Osu! direct for each song creating a download queue directly in Osu!. **This means you do not need to zip up your massive songs folder.** The backup file is only kilobytes big and easily transportable to different systems.

Then, when you want to restore, select the `restore` option in this application. It will ask you where the backup file is, and then will run the restore process.

## Creating a config to suit your environment

Every person's computer is different. Out of the box, this app does not know what your environment is and will ask you what you want to do and where the relevant directories are to perform the backup or restore.

There is also a dedicated option when you launch the app to guide you through a permanent config which will populate the `config.json` file that is generated empty when you first launch the app. When it next runs, it will be aware of the options present there and skip questions already defined in the config. It is also possible for the application to be completely self-sufficient through the config so it runs the task you want and closes when it is done without any manual intervention.

## Compiling the executable

This creates a handy `.exe` file that you can pass around! Once compiled, Node.js is not needed to run the executable anymore.

Run the following commands in order:

- `npm i`
- `npm run compile`

Then `app.exe` will appear in `.bin`.

## Upcoming things I am considering

Because this application is in its infancy I have some upcoming things I want to work on:

- Continued organisation of code
- Backup more than beatmaps
- Ability to have this application run as a scheduled task via CLI arguments/flags
- Link to a cloud service
- A UI (maybe; this might not happen)

## Known problems

During the restore process some beatmaps may open in the browser. This is because the Osu! client is probably not working fast enough to add your beatmaps to the queue and as such falls back to the browser. If this happens, run the restore again after completion and it should pick up on the missing beatmaps. Or, just use the Osu! direct download link on the newly open webpages.

The restore process only adds a beatmap to the queue every 1 second for this reason so you might need to be patient! Or, if you're feeling risky you can edit the restore.ts file in src/actions to decrease the time. 👀
