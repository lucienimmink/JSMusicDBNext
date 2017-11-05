# JSMusicDB Next

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Control by events
use DOM events to control playback state by dispatching events to the mdb-player object
    document.querySelector('mdb-player').dispatchEvent(new Event(eventName));

- 'external.mdbprev' - previous song
- 'external.mdbnext' - next song
- 'external.mdbtoggle' - toggle play/pause

More event will follow to control different part of the app so you can easily intergrate it into other systems.