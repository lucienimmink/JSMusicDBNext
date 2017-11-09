import { Component, OnInit, Input, OnChanges } from '@angular/core';
import Album from './../../org/arielext/musicdb/models/Album';
import Track from './../../org/arielext/musicdb/models/Track';
import { AlbumArtService } from './../album-art.service';
import { AlbumArt } from './album-art';
// import * as PouchDB from 'pouchdb';
import PouchDB from 'pouchdb';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mdb-album-art',
  templateUrl: './album-art.component.html',
  styleUrls: ['./album-art.component.css'],
  providers: [AlbumArtService]
})
export class AlbumArtComponent implements OnInit, OnChanges {
  public albumart: AlbumArt = new AlbumArt();

  @Input() album: Album;
  @Input() track: Track;

  private searchArtist: string;
  private searchAlbum: string;
  private searchType = 'album';
  private NOIMAGE = 'global/images/no-cover.png';
  private arttable = new PouchDB('art');

  constructor(private albumArtService: AlbumArtService) {
    this.albumart.name = 'Unknown album';
    this.albumart.url = this.NOIMAGE;
  }

  ngOnInit() {
    let key = '';
    if (this.album) {
      // album
      this.albumart.name = this.album.name;
      this.searchArtist = this.album.artist.albumArtist || this.album.artist.name;
      this.searchAlbum = this.album.name;
      key = `art-${this.searchArtist}-${this.searchAlbum}`;
    } else {
      // track
      this.albumart.name = this.track.album.name;
      this.searchArtist = this.track.trackArtist;
      this.searchAlbum = this.track.album.name;
      if (this.track.album.artist.isCollection) {
        this.searchType = 'artist';
        key = `art-${this.searchArtist}`;
      } else {
        this.searchType = 'album';
        key = `art-${this.searchArtist}-${this.searchAlbum}`;
      }
    }

    this.arttable.get(key, (err: any, data: any) => {
      if (data) {
        this.setImage(data.url);
      } else {
        this.albumArtService.getAlbumArt(this.searchArtist, this.searchAlbum, this.searchType)
          .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          data => this.setImage(data),
          error => this.albumart.url = this.NOIMAGE
          );
      }
    });

  }

  ngOnChanges(changes) {
    this.ngOnInit();
  }
  setImage(data: any) {
    let dsm = localStorage.getItem('dsm');
    if (dsm) {
      dsm = dsm + '/data/image-proxy?url=';
    }
    if (data === 'global/images/no-cover.png' || data === '' || !data) {
      this.albumArtService.getMediaArtFromLastFm(this.searchArtist, this.searchAlbum, this.searchType)
        .subscribe(
        // tslint:disable-next-line:no-shadowed-variable
        data => {
          if (data && data !== 'global/images/no-cover.png') {
            this.albumart.url = `${dsm}${encodeURIComponent(data)}`;
          } else {
            if (!data) {
              data = this.NOIMAGE;
            }
            this.albumart.url = data;
          }
          const item = {
            _id: `art-${this.searchArtist}-${this.searchAlbum}`,
            url: data
          };
          this.arttable.put(item, function (err: any, response: any) {
            // boring
          });
        },
        error => this.albumart.url = this.NOIMAGE
        );
    } else {
      this.albumart.url = `${dsm}${encodeURIComponent(data)}`;
      const item = {
        _id: `art-${this.searchArtist}-${this.searchAlbum}`,
        url: data
      };
      this.arttable.put(item, function (err: any, response: any) {
        // boring
      });
    }
  }

}
