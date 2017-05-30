import { Component, OnDestroy, ViewChild } from "@angular/core";
import { PlayerService } from './player.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AlbumArt } from './../utils/albumart.component';
import Album from './../org/arielext/musicdb/models/Album';
import Track from './../org/arielext/musicdb/models/Track';
import { LastFMService } from './../lastfm/lastfm.service';
import { CoreService } from './../core.service';
import { musicdbcore } from './../org/arielext/musicdb/core';

import { AnimationService } from './../utils/animation.service';
import { PathService } from './../utils/path.service';
import { AlbumArtService } from './../utils/albumart.service';

import { Playlist } from './../playlists/Playlist';

@Component({
    templateUrl: 'app/player/player.component.html',
    selector: 'mdb-player',
    styleUrls: ['dist/player/player.component.css'],
    providers: [AlbumArtService]
})
export class PlayerComponent implements OnDestroy {
    private subscription: Subscription;
    private subscription2: Subscription;
    private subscription3: Subscription;
    private subscription4: Subscription;
    private subscription5: Subscription;
    private playlist: Playlist;
    private trackIndex: any;
    private track: Track;
    private currentTrack: Track;
    private showPlayer: boolean = false;
    private isPlaying: boolean = false;
    private isPaused: boolean = false;
    private mediaObject: any;
    private hasScrobbledCurrentTrack: boolean = false;
    private url: string;
    private core: musicdbcore;
    private isCurrentPlaylistLoaded: boolean = false;
    private isShuffled: boolean = false;
    private forceRestart: boolean = false;
    private showVolumeWindow: boolean = false;
    private volume: number = 100;
    // onetime check to see if we have a hosted web app
    private isHostedApp: boolean = (typeof Windows !== 'undefined');
    private systemMediaControls: any;
    private displayUpdater: any;
    c: any;

    @ViewChild(AlbumArt) albumart: AlbumArt;

    constructor(private pathService: PathService, private playerService: PlayerService, private router: Router, private lastFMService: LastFMService, private coreService: CoreService, private animationService: AnimationService, private albumartService: AlbumArtService) {
        this.subscription = this.playerService.playlistAnnounced$.subscribe(
            playerData => {
                if (playerData) {
                    this.playlist = playerData.playlist;
                    this.trackIndex = playerData.startIndex;
                    this.isPaused = playerData.isPaused;
                    this.isPlaying = playerData.isPlaying;
                    this.isShuffled = playerData.isShuffled;
                    this.forceRestart = playerData.forceRestart;
                    this.showPlayer = this.isPaused || this.isPlaying;
                    this.setTrack(playerData.position);
                } else {
                    this.isPlaying = false;
                    this.showPlayer = false;
                    this.mediaObject.pause();
                }
            }
        )
        this.subscription5 = this.playerService.hideVolumeWindowAnnounced$.subscribe(() => {
            this.showVolumeWindow = false;
        });
        this.mediaObject = document.querySelector('audio');
        this.mediaObject.crossOrigin = "anonymous";
        this.mediaObject.canPlayType('audio/flac');
        this.mediaObject.addEventListener('ended', () => {
            this.next();
        });
        this.mediaObject.addEventListener('timeupdate', () => {
            this.updateTime();
        });
        this.mediaObject.addEventListener('play', () => {
            this.onplay();
        });
        this.mediaObject.addEventListener('progress', () => {
            this.onprogress();
        });
        this.mediaObject.addEventListener('pause', () => {
            this.onpause();
        });
        this.mediaObject.addEventListener('ended', () => {
            this.onstop();
        });
        let dsm = localStorage.getItem("dsm");
        if (dsm) {
            this.url = dsm;
        }
        this.core = this.coreService.getCore();
        this.subscription2 = this.core.coreParsed$.subscribe(
            data => {
                let state = localStorage.getItem("save-playlist-state");
                if (state && state === "true") {
                    // read the current playlist on startup
                    this.readCurrentPlaylist();
                }
            }
        )
        this.subscription3 = this.playerService.volumeAnnounced.subscribe(volume => {
            this.volume = volume;
            this.mediaObject.volume = this.volume / 100;
        })
        this.subscription4 = pathService.pageAnnounced$.subscribe(
            page => {
                if (page.page === 'Now playing') {
                    this.showVolumeWindow = false;
                }
            }
        );
        if (this.isHostedApp) {
            this.systemMediaControls = Windows.Media.SystemMediaTransportControls.getForCurrentView();
            this.displayUpdater = this.systemMediaControls.displayUpdater;
            this.systemMediaControls.isEnabled = true;
            this.systemMediaControls.isPlayEnabled = true;
            this.systemMediaControls.isPauseEnabled = true;
            this.systemMediaControls.isStopEnabled = true;
            this.systemMediaControls.isNextEnabled = true;
            this.systemMediaControls.isPreviousEnabled = true;
            this.systemMediaControls.addEventListener("buttonpressed", (e: Event) => {
                console.log('systemMediaControlButton is pressed');
                var mediaButton = Windows.Media.SystemMediaTransportControlsButton;
                switch (e.button) {
                    case mediaButton.play:
                        this.mediaObject.play();
                        break;
                    case mediaButton.pause:
                        this.mediaObject.pause();
                        break;
                    case mediaButton.stop:
                        this.playerService.stop();
                        break;
                    case mediaButton.next:
                        this.next();
                        break;
                    case mediaButton.previous:
                        this.prev();
                        break;
                    default:
                        console.warn('key not mapped in application', e.button);
                }
            }, false);
            this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.closed;
            this.c = this;
        }
        // not for mobile or Edge atm
        if (navigator.userAgent.indexOf('Mobi') === -1 && navigator.userAgent.indexOf('Edge/') === -1) {

            // lets only handle these calculations on desktop grade devices.
            let canvas = document.querySelector('canvas');
            let WIDTH = canvas.offsetWidth;
            let HEIGHT = canvas.offsetHeight;

            // set canvas defaults

            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            var ctx = canvas.getContext("2d");

            var audioCtx = new window.AudioContext();
            var javascriptNode = audioCtx.createScriptProcessor(2048, 1, 1);
            javascriptNode.connect(audioCtx.destination);

            var analyser = audioCtx.createAnalyser();
            var source = audioCtx.createMediaElementSource(this.mediaObject);

            var analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            var bufferLength = analyser.frequencyBinCount;
            source.connect(analyser);
            analyser.connect(javascriptNode);

            source.connect(audioCtx.destination);

            javascriptNode.onaudioprocess = function () {
                let canvas = document.querySelector('canvas');
                WIDTH = canvas.offsetWidth;
                HEIGHT = canvas.offsetHeight;
                canvas.width = WIDTH;
                canvas.height = HEIGHT;
                var ctx = canvas.getContext("2d");
                var dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                var barWidth = Math.floor((WIDTH / bufferLength) * 2.5);
                var barHeight;
                var x = 0;
                var y = (HEIGHT / 150) * 1.17;

                for (var i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] * y;
                    ctx.fillStyle = `rgb(0,${Math.floor((barHeight * 0.47) / y)}, ${Math.floor((barHeight * 0.84) / y)})`
                    ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
                    x += barWidth + 1;
                }
            };
        }
    }

    systemMediaControlsButtonPressed(e: Event): void {

    }

    setTrack(position: any) {
        setTimeout(() => {
            if (this.albumart) this.albumart.ngOnInit();
        });
        this.track = this.playlist.tracks[this.trackIndex];
        if ((!this.currentTrack || (this.track && this.currentTrack.id !== this.track.id)) || this.forceRestart) {
            let dsm = localStorage.getItem("dsm");
            if (dsm) {
                this.url = dsm;
            }
            let jwt = localStorage.getItem("jwt");
            this.mediaObject.src = `${this.url}/listen?path=${encodeURIComponent(this.track.source.url)}&jwt=${jwt}`;
            this.currentTrack = this.track;
            this.hasScrobbledCurrentTrack = false;
            this.animationService.requestAnimation('enter', document.querySelector('.player h4'));
            this.animationService.requestAnimation('enter', document.querySelector('.player h5'));
        }
        if (this.isPlaying) {
            this.mediaObject.play();
        } else {
            this.mediaObject.pause();
        }
        if (this.isCurrentPlaylistLoaded) {
            this.mediaObject.currentTime = localStorage.getItem('current-time') || 0;
            this.isCurrentPlaylistLoaded = false; // ignore for all next tracks
        }
        if (position) {
            this.mediaObject.currentTime = position;
        }
    }
    readCurrentPlaylist() {
        let current = JSON.parse(localStorage.getItem('current-playlist'));
        if (current) {
            let core = this.coreService.getCore();
            let list: Array<Track> = [];
            current.ids.forEach(id => {
                let track = core.tracks[id];
                list.push(track);
            });
            let playlist = new Playlist();
            playlist.tracks = list;
            playlist.name = "Current Playlist";
            playlist.isContinues = current.isContinues || false;
            playlist.type = current.type;

            this.isShuffled = current.isShuffled;
            this.isCurrentPlaylistLoaded = true;
            this.playerService.doPlayPlaylist(playlist, current.current, false, current.isShuffled);
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe(); // prevent memory leakage
        this.subscription2.unsubscribe(); // prevent memory leakage
        this.subscription3.unsubscribe(); // prevent memory leakage
        this.mediaObject.removeEventListener('ended');
        this.mediaObject.removeEventListener('timeupdate');
        this.mediaObject.removeEventListener('play');
        this.showVolumeWindow = false;
    }
    navigateToArtist() {
        //this.router.navigate(['Artist', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName }]);
        this.router.navigate(['/letter', this.track.album.artist.letter.escapedLetter, 'artist', this.track.album.artist.sortName]);
    }
    navigateToAlbum() {
        //this.router.navigate(['Album', { letter: this.track.album.artist.letter.escapedLetter, artist: this.track.album.artist.sortName, album: this.track.album.sortName }]);
        this.router.navigate(['/letter', this.track.album.artist.letter.escapedLetter, 'artist', this.track.album.artist.sortName, 'album', this.track.album.sortName]);
    }
    navigateToNowPlaying() {
        // this.router.navigate(['NowPlaying']);
        this.router.navigate(['/now-playing']);
    }
    next() {
        if (this.trackIndex < this.playlist.tracks.length - 1) {
            this.trackIndex++;
            this.playerService.next();
        } else {
            if (this.playlist.isContinues) {
                // generate a new playlist and start playing that one
                this.trackIndex = 0;
                if (this.playlist.type === 'random' || this.playlist.type === 'radio') {
                    this.playerService.nextPlaylist(this.playlist.type);
                } else {
                    this.playerService.nextAlbum(this.track.album);
                }
            } else {
                this.playerService.stop();
            }
        }
    }
    prev() {
        if (this.trackIndex > 0) {
            this.trackIndex--;
            this.playerService.prev();
        }
    }
    togglePlayPause() {
        this.playerService.togglePlayPause();
    }

    updateTime() {
        this.track.position = this.mediaObject.currentTime * 1000;
        if (!this.hasScrobbledCurrentTrack) {
            //TODO: this must be settings; add offline/manual scrobbling
            if (this.track.position >= 4 * 60 * 1000 || this.track.position / this.track.duration >= 0.5) {
                this.hasScrobbledCurrentTrack = true;
                try {
                    this.lastFMService.scrobbleTrack(this.track).subscribe(
                        () => {
                            //console.log('track is scrobbled');
                        }
                    )
                } catch (e) { }
            }
        }
        localStorage.setItem('current-time', this.mediaObject.currentTime.toString());
    }

    onplay() {
        this.lastFMService.announceNowPlaying(this.track).subscribe(
            data => { },
            error => { },
            () => { }
        );
        if ('mediaSession' in navigator) {
            this.albumartService.getAlbumArt(this.track.trackArtist, this.track.album.name, 'album').subscribe(
                data => {
                    // use mediaSession if available
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: this.track.title,
                        artist: this.track.trackArtist,
                        album: this.track.album.name,
                        artwork: [
                            { src: `${data}`, sizes: '500x500', type: 'image/png' }
                        ]
                    });

                    navigator.mediaSession.setActionHandler('play', () => { this.togglePlayPause() });
                    navigator.mediaSession.setActionHandler('pause', () => { this.togglePlayPause() });
                    navigator.mediaSession.setActionHandler('previoustrack', () => { this.prev() });
                    navigator.mediaSession.setActionHandler('nexttrack', () => { this.next() });

                }
            );
        }
        if (this.isHostedApp) {
            this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.playing;
            this.displayUpdater.type = Windows.Media.MediaPlaybackType.music;
            this.albumartService.getAlbumArt(this.track.trackArtist, this.track.album.name, 'album').subscribe(
                data => {
                    // update system transport
                    try {
                        if (this.displayUpdater != undefined) {
                            this.displayUpdater.musicProperties.albumArtist = this.track.trackArtist;
                            this.displayUpdater.musicProperties.artist = this.track.trackArtist;
                            this.displayUpdater.musicProperties.albumTitle = this.track.album.name;
                            this.displayUpdater.musicProperties.title = this.track.title;
                            if (data) {
                                this.displayUpdater.thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(new Windows.Foundation.Uri(data));
                            }
                            this.displayUpdater.update();
                        }
                    } catch (e) {
                        console.error('error occurred', e);
                    }
                    // update live tile
                    var Notifications = Windows.UI.Notifications;
                    Notifications.TileUpdateManager.createTileUpdaterForApplication('App').clear();
                    var tileXml = Notifications.TileUpdateManager.getTemplateContent(Notifications.TileTemplateType.tileSquare150x150PeekImageAndText02);
                    var textNode = tileXml.getElementsByTagName("text")[0];
                    textNode.innerText = this.track.title;
                    textNode = tileXml.getElementsByTagName("text")[1];
                    textNode.innerText = this.track.trackArtist;
                    if (data) {
                        var imageNode = tileXml.getElementsByTagName("image")[0];
                        imageNode.attributes[1].value = data;
                    }
                    var currentTime = new Date();
                    var expiryTime = new Date(currentTime.getTime() + Number(this.track.duration));
                    var tileNotification = new Notifications.TileNotification(tileXml);
                    tileNotification.expirationTime = expiryTime;
                    Notifications.TileUpdateManager.createTileUpdaterForApplication('App').update(tileNotification);
                }
            );
        }
        document.querySelector('mdb-player').dispatchEvent(new CustomEvent('external.mdbplaying', { 'detail': this.track }));
    }
    onstop() {
        document.querySelector('mdb-player').dispatchEvent(new Event('external.mdbstopped'));
        if (this.isHostedApp) {
            this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.stopped;
        }
    }
    onpause() {
        document.querySelector('mdb-player').dispatchEvent(new CustomEvent('external.mdbpaused', { 'detail': this.track }));
        if (this.isHostedApp) {
            this.systemMediaControls.playbackStatus = Windows.Media.MediaPlaybackStatus.paused;
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.playerService.shufflePlaylist(this.isShuffled);
    }
    toggleLoved() {
        this.track.isLoved = !this.track.isLoved;
        this.lastFMService.toggleLoved(this.track).subscribe(
            data => { }
        )
    }
    toggleVolumeWindow(e: Event) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        this.showVolumeWindow = !this.showVolumeWindow;
    }
    onprogress() {
        let buffered = this.mediaObject.buffered;
        if ((buffered.length !== 0)) {
            this.track.buffered.start = buffered.start((buffered.length !== 0) ? buffered.length - 1 : 0) * 1000;
            this.track.buffered.end = buffered.end((buffered.length !== 0) ? buffered.length - 1 : 0) * 1000
        }
    }
    setVolume() {
        this.mediaObject.volume = this.volume / 100;
        this.playerService.setVolume(this.volume) // update the shared volume property
    }
    jump(e: any): void {
        let clientX = e.clientX || e.changedTouches[0].clientX;
        let left = clientX, perc = (left / document.querySelector('.player').clientWidth);
        let pos = this.track.duration / 1000 * perc;
        this.playerService.setPosition(pos);
    }
}
