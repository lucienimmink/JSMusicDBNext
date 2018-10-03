import Letter from './letter';
import Artist from './artist';
import Album from './album';
import Track from './track';

const letters = {};
const artists = {};
const albums = {};
const tracks = {};
const years = {};

const sortedLetters = [];
const sortedAlbums = [];

const totals = {
  artists: 0,
  albums: 0,
  tracks: 0,
  playingtime: 0
};

const instanceIfPresent = (key, map, obj, excecuteIfNew) => {
  if (map[key]) {
    return map[key];
  }
  map[key] = obj;
  excecuteIfNew();
  return obj;
};

const parseLine = (line) => {
  const letter = new Letter(line);
  if (letter.letter) {
    const coreLetter = instanceIfPresent(letter.letter, letters, letter, () => true);
    const artist = new Artist(line);
    const coreArtist = instanceIfPresent(artist.sortName, artists, artist, () => {
      coreLetter.artists.push(artist);
      totals.artists += 1;
    });
    const album = new Album(line);
    const coreAlbum = instanceIfPresent(`${artist.sortName}|${album.sortName}`, albums, album, () => {
      coreArtist.albums.push(album);
      coreArtist.sortAndReturnAlbumsBy('year', 'asc');
      totals.albums += 1;

      // add to year
      years[album.year] = years[album.year] || [];
      years[album.year].push(album);
    });
    const track = new Track(line);
    if (coreAlbum.type && coreAlbum.type !== track.type) {
      coreAlbum.type = 'mixed';
    } else {
      coreAlbum.type = track.type;
    }
    totals.tracks += 1;
    totals.playingtime += track.duration;
    coreAlbum.tracks.push(track);
    const { disc } = track;
    coreAlbum.discs[`disc-${disc}`] = coreAlbum.discs[disc] || [];
    coreAlbum.discs[`disc-${disc}`].push(track);
    coreAlbum.discs[`disc-${disc}`].sort((a, b) => {
      if (a.number < b.number) {
        return -1;
      }
      return 1;
    });
    // sort all tracks firstly by disc, then by number
    coreAlbum.tracks.sort((a, b) => {
      if (a.disc < b.disc) {
        return -1;
      }
      if (a.disc === b.disc) {
        if (a.number < b.number) {
          return -1;
        }
        return 1;
      }
      return 1;
    });
  }
};

export default {
  getCollection(json) {
    const start = new Date().getTime();
    json.forEach((line) => {
      parseLine(line);
    });
    // once done, sort
    Object.keys(letters)
      .sort((a, b) => (a < b ? -1 : 1))
      .forEach((key) => {
        sortedLetters.push(letters[key]);
      });
    // once done update totals
    totals.parsingTime = new Date().getTime() - start;
    return {
      sortedLetters,
      letters,
      artists,
      sortedAlbums,
      albums,
      tracks,
      years,
      totals
    };
  }
};
