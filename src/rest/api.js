import Vue from 'vue';

const vue = new Vue();

const doCall = (method, url, data) =>
  new Promise((resolve, reject) => {
    vue.$http[method](url, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((response) => {
        reject(response);
      });
  });

export default {
  getCollection() {
    return doCall('get', '/data/node-music.json');
  }
};
