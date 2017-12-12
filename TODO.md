- FOR JUSTIN: create a multi-user system filtering direct messages, messages from the server, and messages from the superuser (console).

- Also start mounting EVERY node module, no idea when it might come in handy.

- Add a config editing command for working with KLARI remotely
- Add a "power" object to config for scheduling wake times and what not
- Add power control commands like shutdown, reboot, sleep
- Add logging to file in the engine

- Add the startup sound with ffmpeg (and for making more klari sounds, go to IBM's tts machine and remember that pitch="150Hz")
- Add a "sudo" intercept to the command processor so that commands like modifying config and setting power schedules are all defined *INTERNALLY* (also add a permission system to that sudo intercept so randos cant just k>sudo and kill the bot)
- Eventually add a permissions system?