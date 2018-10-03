<template>
<div class="container-fluid">
    <div class="row at-row flex-center">
      <div class="col-md-4" v-for="album in getActiveArtist($route.params.artistId).albums" v-bind:key="album.name">
        <router-link :to="{name: 'album-detail', params: { letterId: $route.params.letterId, artistId: $route.params.artistId, albumId: album.name}}">
          <at-card :body-style="{ padding: 0}">
            <img style="width: 100%" src="https://misc.aotu.io/koppthe/at-ui/cover.jpg">
            <div style="padding: 14px;">
              <p>{{album.name}} <br />
                <span class="small muted">Year: {{album.year}}</span>
              </p>
            </div>
          </at-card>
        </router-link>
      </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'letter-detail',
  computed: {
    ...mapGetters('collection', {getActiveLetter: 'getActiveLetterById', getActiveArtist: 'getActiveArtistById'})
  }
}
</script>

<style lang="postcss" scoped>
  .at-card {
    margin: 1em;
  }
  .small {
    font-size: 0.9em;
  }
  .muted {
    opacity: 0.7;
  }
</style>
