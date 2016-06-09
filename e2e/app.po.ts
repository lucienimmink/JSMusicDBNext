export class JSMusicDBNextPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('jsmusic-dbnext-app h1')).getText();
  }
}
