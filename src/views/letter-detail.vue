<template>
  <div class="container-fluid">
      <div class="row at-row flex-center">
        <div class="col-md-4" v-for="artist in getActiveLetter($route.params.letterId).artists" v-bind:key="artist.name">
          <router-link :to="{name: 'artist-detail', params: { letterId: $route.params.letterId, artistId: artist.sortName}}">
            <at-card :body-style="{ padding: 0}">
              <img src="https://misc.aotu.io/koppthe/at-ui/cover.jpg">
              <div>
                <p>{{artist.name}} <br />
                  <span class="small muted">Albums: {{artist.albums.length}}</span>
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
import artistPanel from '@/shared/components/artists/artist-panel.vue';

export default {
  name: 'letter-detail',
  computed: {
    ...mapGetters('collection', {getActiveLetter: 'getActiveLetterById'})
  },
  mounted() {
    this.$store.dispatch("letter/setActive", this.$route.params.letterId);
  },
  components: { artistPanel }
}
</script>

<style lang="postcss" scoped>
  .at-card {
    margin: 1em;
  }
  img {
    width: 100%;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .small {
    font-size: 0.9em;
  }
  .muted {
    opacity: 0.7;
  }
</style>
