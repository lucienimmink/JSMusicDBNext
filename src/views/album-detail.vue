<template>
<div class="container">
  <div class="row at-row flex-center">
    <at-table :data="album.tracks" :columns="columns" stripe :border="false"></at-table>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { format }  from 'date-fns';

export default {
  data () {
    return {
      columns: [{
        title: 'number',
        key: 'number'
      }, {
        title: 'title',
        render: (h, params) => {
          return h('div', [h('div', {}, params.item.title), h('div', {'class': 'small muted'}, params.item.trackArtist)])
        }
      }, {
        title: 'duration',
        render: (h, params) => {
          return h('span', {}, format(params.item.duration, 'mm:ss'))
        }
      }]
    }
  },
  name: 'album-detail',
  computed: {
    ...mapGetters('collection', {getActiveLetter: 'getActiveLetterById', getActiveArtist: 'getActiveArtistById', getActiveAlbum: 'getActiveAlbumById'}),
    album: function () {
      return this.getActiveAlbum(`${this.$route.params.artistId}|${this.$route.params.albumId.toUpperCase()}`)
    }
  }
}
</script>

<style lang="postcss">
  .at-table {
    width: 100%;
    font-size: 1em;
  }
  .at-table__content {
    border: 0;
  }
  .at-table__thead {
    display: none;
  }
  .small {
    font-size: 0.9em;
  }
  .muted {
    opacity: 0.7;
  }
  .at-table table td {
    padding: 16px;
    vertical-align: top;
    border: 0;
  }
  .at-table table tr td:last-child {
    text-align: right;
  }
</style>
