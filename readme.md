# Build
    npm install
# Run on develop
    npm run start
# Build for production
    npm run deploy
# Control by events
use DOM events to control playback state by dispatching events to the mdb-player object
    document.querySelector('mdb-player').dispatchEvent(new Event(eventName));

- 'external.mdbprev' - previous song
- 'external.mdbnext' - next song
- 'external.mdbtoggle' - toggle play/pause

More event will follow to control different part of the app so you can easily intergrate it into other systems.