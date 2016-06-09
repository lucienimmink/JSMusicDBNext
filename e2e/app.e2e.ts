import { JSMusicDBNextPage } from './app.po';

describe('jsmusic-dbnext App', function() {
  let page: JSMusicDBNextPage;

  beforeEach(() => {
    page = new JSMusicDBNextPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('jsmusic-dbnext works!');
  });
});
