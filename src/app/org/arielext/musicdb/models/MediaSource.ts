export default class MediaSource {
  public url: string;

  constructor(json: any) {
    this.url = json.file || json.url || json.path || json.id;
  }
}
