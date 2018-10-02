<template>
  <div>
    {{$route.params.artistId}} <br />
    {{getActiveArtist($route.params.artistId).albums.length}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import artistPanel from '@/shared/components/artists/artist-panel.vue';

export default {
  name: 'letter-detail',
  computed: {
    ...mapGetters('collection', {getActiveLetter: 'getActiveLetterById', getActiveArtist: 'getActiveArtistById'})
  },
  mounted() {
    this.$store.dispatch("letter/setActive", this.$route.params.letterId);
  },
  components: { artistPanel }
}
</script>

<style>

</style>
