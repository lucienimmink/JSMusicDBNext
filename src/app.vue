<template>
  <div class="app">
    <transition>
      <div v-if="loading">Loading please wait</div>
    </transition>
    <transition>
      <div v-if="!loading && collection.letters">
        <header>
          <letter-panel v-for="letter in collection.sortedLetters" v-bind:key="letter.letter" :letter="letter"/>
        </header>
        <router-view :key="$route.path"></router-view>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import styles from '@/shared/js/styles';
import letterPanel from '@/shared/components/letters/letter-panel.vue';

export default {
  name: 'app',
  created() {
      this.$store.dispatch("collection/get");
  },
  computed: {
    ...mapGetters('collection', {collection: 'collection', loading: 'loading'})
  },
  components: {
    letterPanel
  }
}
</script>

<style lang="postcss" scoped>
@import './styles/colors.css';
.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 100%;
}
header {
  display: flex;
  height: 50px;
  width: 100%;
  background: var(--primary);
}
</style>
