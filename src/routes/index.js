const artistDetail = () => import(/* webpackChunkName: "artists" */ '@/views/artist-detail.vue');

const albumDetails = () => import(/* webpackChunkName: "artists" */ '@/views/album-detail.vue');

const letterDetail = () => import(/* webpackChunkName: "letters" */ '@/views/letter-detail.vue');

export default [
  {
    path: '/',
    name: 'app'
  },
  {
    path: '/letter/:letterId',
    name: 'letter-detail',
    component: letterDetail
  },
  {
    path: '/letter/:letterId/artist/:artistId',
    name: 'artist-detail',
    component: artistDetail
  },
  {
    path: '/letter/:letterId/artist/:artistId/album/:albumId',
    name: 'album-detail',
    component: albumDetails
  }
];
