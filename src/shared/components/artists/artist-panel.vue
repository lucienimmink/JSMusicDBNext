<template>
  <router-link :to="artist.url().replace(/{escapedLetter}/, this.escapedLetter)">
    {{artist.name}}
  </router-link>
</template>

<script>
export default {
  name: 'artist-panel',
  props: [ "artist", "escapedLetter" ]
}
</script>

<style>

</style>
