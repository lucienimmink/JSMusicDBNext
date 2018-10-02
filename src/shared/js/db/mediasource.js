export default class MediaSource {
  constructor(json) {
    this.url = json.file || json.url || json.path || json.id;
  }
}
