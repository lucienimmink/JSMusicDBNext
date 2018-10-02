<template>
  <a :href="letter.url()" :class="{'active': (activeLetter) ? letter.letter === activeLetter.letter: false}" @click.prevent="selectLetter()">
    {{letter.letter}}
  </a>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'letter-panel',
  computed: {
    ...mapGetters('collection', {collection: 'collection', loading: 'loading'}),
    ...mapGetters('letter', { activeLetter: 'activeLetter'})
  },
  props: [ 'letter' ],
  methods: {
    selectLetter() {
      this.$store.dispatch("letter/setActive", this.letter);
    }
  }
}
</script>

<style lang="postcss" scoped>
  @import '/styles/colors.css';
  a {
    flex-grow: 1;
    text-align: center;
    color: var(--white);
    will-change: background;
    transition: background 0.2s ease-in;
    font-size: 1.5em;
    padding-top: 0.4em;
  }
</style>
