# JSMusicDB Next

A web standards based music database and player.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run prod` to build the project. The build artifacts will be stored in the `dist/` directory.

## Control by events

use DOM events to control playback state by dispatching events to the mdb-player object
document.querySelector('mdb-player').dispatchEvent(new Event(eventName));

* 'external.mdbprev' - previous song
* 'external.mdbnext' - next song
* 'external.mdbtoggle' - toggle play/pause

More event will follow to control different part of the app so you can easily intergrate it into other systems.

## React to events

mdb-player will also emit events when something happens:

* 'external.mdbplaying' - Player is playing a song; event detail object: the playing song
* 'external.mdbstopped' - Player is stopped
* 'external.mdbpaused' - Player has paused a song; event detail object: the playing song
* 'external.mdbscanstart' - A collection refresh has started
* 'external.mdbscanning' - The collection is refreshing; eventr detail object: percentage: [percentage done]
* 'external.mdbscanstop' - A collection refresh has been done
