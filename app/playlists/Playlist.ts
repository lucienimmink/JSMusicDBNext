import Track from './../org/arielext/musicdb/models/track';

export class Playlist {
    public name: string;
    public tracks: Array<Track> = [];
    public isOwn:boolean = false;
    public isContinues:boolean = false;
}