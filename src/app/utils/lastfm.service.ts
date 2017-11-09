import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MyQueryEncoder } from './my-query-encoder';
import Artist from './../org/arielext/musicdb/models/Artist';
import Track from './../org/arielext/musicdb/models/Track';
// import * as PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';

const APIKEY = '956c1818ded606576d6941de5ff793a5';
const SECRET = '4d183e73f7578dee78557665e9be3acc';
const NOIMAGE = 'global/images/no-cover.png';

const recentlyListenedTable = new PouchDB('recentlyListened');
const arttable = new PouchDB('art');

@Injectable()
export class LastfmService {
  private hexcase = 0;
  private b64pad = '';
  private manualScrobbleListSource = new Subject<any>();
  public manualScrobbleList$: Observable<any> = this.manualScrobbleListSource.asObservable();
  private recentlyListenedTable = recentlyListenedTable;
  private arttable = arttable;

  constructor(private http: Http) { }

  getLovedTracks(user: string): Observable<any> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
    urlSearchParams.set('api_key', APIKEY);
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('limit', '1000');
    urlSearchParams.set('method', 'user.getlovedtracks');
    urlSearchParams.set('user', user);

    const query: RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('https://ws.audioscrobbler.com/2.0/', query)
      .map(this.extractLastFMLoved)
      .catch(this.handleError);
  }
  toggleLoved(track: Track): Observable<any> {
    const sk = localStorage.getItem('lastfm-token');
    const urlSearchParams: URLSearchParams = new URLSearchParams();
    const method: string = (track.isLoved) ? 'track.love' : 'track.unlove';
    urlSearchParams.set('method', method);
    urlSearchParams.set('api_key', APIKEY);
    urlSearchParams.set('api_sig', this.signTrack(track.trackArtist, track.album.name, track.title, null, sk, method));
    urlSearchParams.set('artist', track.trackArtist);
    urlSearchParams.set('album', track.album.name);
    urlSearchParams.set('track', track.title);
    urlSearchParams.set('sk', sk);

    const headers = new Headers();
    headers.append('Content-Type',
      'application/x-www-form-urlencoded');

    return this.http.post('https://ws.audioscrobbler.com/2.0/', urlSearchParams.toString(), {
      headers: headers
    })
      .map(this.noop)
      .catch(this.handleError);
  }

  getTrackInfo(track: Track, user: string): Observable<any> {
    if (track) {
      const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
      urlSearchParams.set('method', 'track.getInfo');
      urlSearchParams.set('artist', track.trackArtist);
      urlSearchParams.set('album', track.album.name);
      urlSearchParams.set('track', track.title);
      urlSearchParams.set('api_key', APIKEY);
      urlSearchParams.set('format', 'json');
      urlSearchParams.set('user', user);

      const query: RequestOptionsArgs = {
        search: urlSearchParams
      };

      return this.http.get('https://ws.audioscrobbler.com/2.0/', query)
        .map(this.extractTrackInfo)
        .catch(this.handleError);
    } else {
      return Observable.throw(null);
    }
  }

  getTopArtists(user: string): Observable<any> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
    urlSearchParams.set('api_key', APIKEY);
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('limit', '50');
    urlSearchParams.set('method', 'user.gettopartists');
    urlSearchParams.set('period', '1month');
    urlSearchParams.set('user', user);

    const query: RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('https://ws.audioscrobbler.com/2.0/', query)
      .map(this.extractLastFMTop)
      .catch(this.handleError);
  }

  getSimilairArtists(artist: Artist): Observable<any> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
    urlSearchParams.set('api_key', APIKEY);
    urlSearchParams.set('format', 'json');
    urlSearchParams.set('limit', '20');
    urlSearchParams.set('autocorrect', '1');
    urlSearchParams.set('method', 'artist.getSimilar');
    urlSearchParams.set('artist', artist.name);

    const query: RequestOptionsArgs = {
      search: urlSearchParams
    };

    return this.http.get('https://ws.audioscrobbler.com/2.0/', query)
      .map(this.extractLastFMSimilair)
      .catch(this.handleError);
  }

  authenticate(user: any): Observable<any> {
    const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
    urlSearchParams.set('api_key', APIKEY);
    urlSearchParams.set('api_sig', this.signAuthentication(user.user, user.password));
    urlSearchParams.set('username', user.user);
    urlSearchParams.set('password', user.password);

    const headers = new Headers();
    headers.append('Content-Type',
      'application/x-www-form-urlencoded');

    return this.http.post('https://ws.audioscrobbler.com/2.0/?method=auth.getMobileSession', urlSearchParams.toString(), {
      headers: headers
    })
      .map(this.extractAuthenticate)
      .catch(this.handleError);
  }

  announceNowPlaying(track: Track): Observable<any> {
    const username = localStorage.getItem('lastfm-username');
    if (username !== 'mdb-skipped') {
      const now = new Date();
      const timestamp = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(),
        now.getMinutes() + now.getTimezoneOffset(), now.getSeconds()) / 1000;
      const sk = localStorage.getItem('lastfm-token');
      const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
      urlSearchParams.set('method', 'track.updateNowPlaying');
      urlSearchParams.set('api_key', APIKEY);
      urlSearchParams.set('api_sig', this.signTrack(track.trackArtist, track.album.name, track.title,
        timestamp, sk, 'track.updateNowPlaying'));
      urlSearchParams.set('artist', track.trackArtist);
      urlSearchParams.set('album', track.album.name);
      urlSearchParams.set('track', track.title);
      urlSearchParams.set('timestamp', timestamp.toString());
      urlSearchParams.set('sk', sk);

      const headers = new Headers();
      headers.append('Content-Type',
        'application/x-www-form-urlencoded');

      return this.http.post('https://ws.audioscrobbler.com/2.0/', urlSearchParams.toString(), {
        headers: headers
      })
        .map(this.noop)
        .catch(this.handleError);
    } else {
      return Observable.throw(null);
    }
  }

  scrobbleTrack(track: Track): any {
    const username = localStorage.getItem('lastfm-username');
    const now = new Date();
    const timestamp = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(),
      now.getMinutes() + now.getTimezoneOffset(), now.getSeconds()) / 1000;
    if (username !== 'mdb-skipped') {
      const sk = localStorage.getItem('lastfm-token');
      const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
      urlSearchParams.set('method', 'track.scrobble');
      urlSearchParams.set('api_key', APIKEY);
      urlSearchParams.set('api_sig', this.signTrack(track.trackArtist, track.album.name, track.title, timestamp, sk, 'track.scrobble'));
      urlSearchParams.set('artist', track.trackArtist);
      urlSearchParams.set('album', track.album.name);
      urlSearchParams.set('track', track.title);
      urlSearchParams.set('timestamp', timestamp.toString());
      urlSearchParams.set('sk', sk);

      const headers = new Headers();
      headers.append('Content-Type',
        'application/x-www-form-urlencoded');

      const saveScrobble = this.booleanState('manual-scrobble-state');
      if (!saveScrobble) {
        return this.http.post('https://ws.audioscrobbler.com/2.0/', urlSearchParams.toString(), {
          headers: headers
        })
          .map(this.noop)
          .catch(this.handleError);
      } else {
        // save details
        const offlineCache = JSON.parse(localStorage.getItem('manual-scrobble-list')) || [];
        const cachedItem = {
          artist: track.trackArtist,
          album: track.album.name,
          track: track.title,
          timestamp: timestamp.toString()
        };
        offlineCache.unshift(cachedItem);
        this.manualScrobbleListSource.next(offlineCache); // set the subscribers know that the list is updated
        localStorage.setItem('manual-scrobble-list', JSON.stringify(offlineCache));
      }
    } else {
      const key = `art-${track.trackArtist}-${track.album.name}`;
      const c = this;
      const imageurl = NOIMAGE;
      this.arttable.get(key, function (err: any, data: any) {
        if (data) {
          c.saveInLocal(track, timestamp, data.url);
        } else {
          c.saveInLocal(track, timestamp, NOIMAGE);
        }
      });
    }
  }
  saveInLocal(track: Track, timestamp: number, imageurl: string): void {
    const c = this;
    const cachedItem = {
      artist: {
        '#text': track.trackArtist
      },
      album: {
        '#text': track.album.name
      },
      image: [{
        '#text': imageurl
      }],
      name: track.title,
      date: {
        uts: timestamp
      }
    };
    let tracks: Array<any> = [];
    let rev: string = null;
    this.recentlyListenedTable.get('recentlyListened', function (err: any, data: any) {
      if (data) {
        tracks = data.tracks;
        if (tracks.length > 10) {
          tracks = tracks.splice(0, 10);
        }
        rev = data._rev;
      }
      tracks.unshift(cachedItem);
      const item = {
        _id: `recentlyListened`,
        _rev: rev,
        tracks: tracks
      };
      // tslint:disable-next-line:no-shadowed-variable
      c.recentlyListenedTable.put(item, function (err: any, res: any) { });
    });
  }
  scrobbleCachedTrack(cachedTrack: any) {
    const sk = localStorage.getItem('lastfm-token');
    const urlSearchParams: URLSearchParams = new URLSearchParams('', new MyQueryEncoder());
    urlSearchParams.set('method', 'track.scrobble');
    urlSearchParams.set('api_key', APIKEY);
    urlSearchParams.set('api_sig', this.signTrack(cachedTrack.artist, cachedTrack.album, cachedTrack.track,
      cachedTrack.timestamp, sk, 'track.scrobble'));
    urlSearchParams.set('artist', cachedTrack.artist);
    urlSearchParams.set('album', cachedTrack.album);
    urlSearchParams.set('track', cachedTrack.track);
    urlSearchParams.set('timestamp', cachedTrack.timestamp);
    urlSearchParams.set('sk', sk);

    const headers = new Headers();
    headers.append('Content-Type',
      'application/x-www-form-urlencoded');

    return this.http.post('https://ws.audioscrobbler.com/2.0/', urlSearchParams.toString(), {
      headers: headers
    })
      .map(this.noop)
      .catch(this.handleError);
  }

  private booleanState(key: string): boolean {
    const raw = localStorage.getItem(key);
    if (raw && raw === 'true') {
      return true;
    }
    return false;
  }

  private extractAuthenticate(response: Response) {
    const responseText = response.text();
    const responseXml = new DOMParser().parseFromString(responseText, 'text/xml');
    return responseXml.getElementsByTagName('key')[0].textContent;
  }

  private extractTrackInfo(response: Response) {
    const json = response.json();
    if (json.track && json.track.userloved && json.track.userloved === '1') {
      return true;
    }
    return false;
  }

  private noop(response: Response) {
    return true;
  }

  private signAuthentication(user: string, password: string): string {
    return this.hex_md5(`api_key${APIKEY}methodauth.getMobileSessionpassword${password}username${user}${SECRET}`);
  }

  private signTrack(artist: string, album: string, track: string, timestamp: number, sk: string, method: string): string {
    if (timestamp) {
      return this.hex_md5(`album${album}api_key${APIKEY}artist${artist}method${method}sk${sk}timestamp${timestamp}track${track}${SECRET}`);
    } else {
      return this.hex_md5(`album${album}api_key${APIKEY}artist${artist}method${method}sk${sk}track${track}${SECRET}`);
    }
  }

  private extractLastFMLoved(res: Response): Array<any> {
    const json = res.json();
    if (json.lovedtracks) {
      return json.lovedtracks.track;
    } else {
      return [];
    }
  }

  private extractLastFMTop(res: Response): Array<any> {
    const json = res.json();

    if (json.topartists) {
      return json.topartists.artist;
    } else {
      return [];
    }
  }

  private extractLastFMSimilair(res: Response): Array<any> {
    const json = res.json();

    if (json.similarartists) {
      return json.similarartists.artist;
    } else {
      return [];
    }
  }

  private handleError(error: any) {
    return Observable.throw(null);
  }


  /* These functions implement a RSA encryption in JavaScript */
  private hex_md5(s: string) {
    return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
  }
  private rstr2hex(input: string) {
    try {
      this.hexcase = this.hexcase;
    } catch (e) {
      this.hexcase = 0;
    }
    const hex_tab = this.hexcase ? '0123456789ABCDEF' : '0123456789abcdef';
    let output = '';
    let x: number;
    for (let i = 0; i < input.length; i++) {
      x = input.charCodeAt(i);
      // tslint:disable-next-line:no-bitwise
      output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
  }
  private rstr_md5(s: string) {
    return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
  }
  private str2rstr_utf8(input: string) {
    let output = '';
    let i = -1;
    let x: number, y: number;

    while (++i < input.length) {
      /* Decode utf-16 surrogate pairs */
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
        // tslint:disable-next-line:no-bitwise
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
        i++;
      }

      /* Encode output as utf-8 */
      if (x <= 0x7F) {
        output += String.fromCharCode(x);
      } else if (x <= 0x7FF) {
        // tslint:disable-next-line:no-bitwise
        output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
      } else if (x <= 0xFFFF) {
        // tslint:disable-next-line:no-bitwise
        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
      } else if (x <= 0x1FFFFF) {
        // tslint:disable-next-line:no-bitwise
        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
      }
    }
    return output;
  }
  private binl2rstr(input: any) {
    let output = '';
    for (let i = 0; i < input.length * 32; i += 8) {
      // tslint:disable-next-line:no-bitwise
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
    }
    return output;
  }
  private binl_md5(x: any, len: number) {
    /* append padding */
    // tslint:disable-next-line:no-bitwise
    x[len >> 5] |= 0x80 << ((len) % 32);
    // tslint:disable-next-line:no-bitwise
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;

      a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
      d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
      b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
      d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
      b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
      d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
      b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
      d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
      b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

      a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
      d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
      b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
      a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
      d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
      b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
      d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
      b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
      d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
      b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

      a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
      d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
      b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
      d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
      b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
      d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
      c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
      b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
      d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
      b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

      a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
      d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
      b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
      d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
      b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
      d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
      b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
      d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
      b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

      a = this.safe_add(a, olda);
      b = this.safe_add(b, oldb);
      c = this.safe_add(c, oldc);
      d = this.safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  }
  private rstr2binl(input: string) {
    // tslint:disable-next-line:no-bitwise
    const output = Array(input.length >> 2);
    for (let i = 0; i < output.length; i++) {
      output[i] = 0;
    }
    for (let i = 0; i < input.length * 8; i += 8) {
      // tslint:disable-next-line:no-bitwise
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    return output;
  }

  private md5_cmn(q: any, a: any, b: any, x: any, s: any, t: any) {
    return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
  }
  private md5_ff(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
    // tslint:disable-next-line:no-bitwise
    return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  private md5_gg(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
    // tslint:disable-next-line:no-bitwise
    return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  private md5_hh(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
    // tslint:disable-next-line:no-bitwise
    return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }

  private md5_ii(a: any, b: any, c: any, d: any, x: any, s: any, t: any) {
    // tslint:disable-next-line:no-bitwise
    return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }
  private safe_add(x: any, y: any) {
    // tslint:disable-next-line:no-bitwise
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    // tslint:disable-next-line:no-bitwise
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    // tslint:disable-next-line:no-bitwise
    return (msw << 16) | (lsw & 0xFFFF);
  }
  private bit_rol(num: number, cnt: number) {
    // tslint:disable-next-line:no-bitwise
    return (num << cnt) | (num >>> (32 - cnt));
  }
}
