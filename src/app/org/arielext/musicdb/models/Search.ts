import Fuse from "fuse.js";

export default class Search {
  public doSearch = ({ query, keys = ["name"], list }) => {
    const fuse = new Fuse(list, this.options(keys));
    return fuse.search(query);
  };
  private options = keys => {
    return {
      keys,
      threshold: 0.25, // how fuzy am I allowed to be?
      shouldSort: true,
    };
  };
}
