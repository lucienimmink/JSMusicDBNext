import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { JSMusicDBNextAppComponent } from '../app/jsmusic-dbnext.component';

beforeEachProviders(() => [JSMusicDBNextAppComponent]);

describe('App: JSMusicDBNext', () => {
  it('should create the app',
      inject([JSMusicDBNextAppComponent], (app: JSMusicDBNextAppComponent) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'jsmusic-dbnext works!\'',
      inject([JSMusicDBNextAppComponent], (app: JSMusicDBNextAppComponent) => {
    expect(app.title).toEqual('jsmusic-dbnext works!');
  }));
});
