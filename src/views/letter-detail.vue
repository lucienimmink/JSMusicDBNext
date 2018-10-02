<template>
  <div>
    <artist-panel v-for="artist in getActiveLetter($route.params.letterId).artists" v-bind:key="artist.name" :artist="artist" :escaped-letter="getActiveLetter($route.params.letterId).escapedLetter"/>
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

<style>

</style>
