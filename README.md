# Osu backup

This simple application is a CLI utility that will help you backup and restore your beatmaps. More backup data will be added soon.

## How this utility works

Before I continue I must mention you need Osu! supporter because this client takes advantage of Osu! direct.

How this works is it reads the beatmap IDs from each beatmap and stores a list of them in the backup file. Then, when you go to restore your backup, this program will summon Osu! direct for each song creating a download queue directly in Osu!. **This means you do not need to zip up your massive songs folder.** The backup file is only kilobytes big and easily transportable to different systems.

## Upcoming things I am considering

Because this client is in its infancy and is quite rough (may crash if you do not provide the right details) I have some upcoming things I want to work on:

- Continued organisation of code
- Backup more than beatmaps
- Ability to have this program run as a scheduled task or detect file changes in the Osu! installation creating automatic backups
- Link to a cloud service
- A UI (maybe; this might not happen)
