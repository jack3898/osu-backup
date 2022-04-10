# Osu backup

This simple application is a CLI utility that will help you backup and restore your beatmaps. More backup data will be added soon.

## How this utility works

Before I continue I must mention you need Osu! supporter because this client takes advantage of Osu! direct.

How this works is it reads the beatmap IDs from each beatmap and stores a list of them in the backup file. Then, when you go to restore your backup, this program will summon Osu! direct for each song creating a download queue directly in Osu!. **This means you do not need to zip up your massive songs folder.** The backup file is only kilobytes big and easily transportable to different systems.

Then, when you want to restore, select the `restore` option in this utility. It will ask you where the backup file is, and then will run the restore process.

## Compiling the executable

This creates a handy `.exe` file that you can pass around! Once compiled, Node.js is not needed to run the executable but you do need Node.js to compile this utility, however.

Run the following commands in order:

- `npm i`
- `npm run compile`

Then `app.exe` will appear in `.bin`.

## Upcoming things I am considering

Because this client is in its infancy I have some upcoming things I want to work on:

- Continued organisation of code
- Backup more than beatmaps
- Ability to have this program run as a scheduled task or detect file changes in the Osu! installation creating automatic backups
- Link to a cloud service
- A UI (maybe; this might not happen)

## Known problems

During the restore process some beatmaps may open in the browser. This is because the Osu! client is probably not working fast enough to add your beatmaps to the queue and as such falls back to the browser. If this happens, run the restore again after completion and it should pick up on the missing beatmaps. Or, just use the Osu! direct download link on the newly open webpages.

The restore process only adds a beatmap to the queue every 1 second for this reason so you might need to be patient! Or, if you're feeling risky you can edit the restore.ts file in src/actions to decrease the time. 👀
