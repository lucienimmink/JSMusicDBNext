<template>
  <div class="app">
    <transition>
      <div v-if="loading">Loading please wait</div>
    </transition>
    <transition>
      <div v-if="!loading && collection.letters">
        <header>
          <at-menu mode="horizontal" router>
            <at-menu-item v-for="letter in collection.sortedLetters" v-bind:key="letter.letter" :to="{name: 'letter-detail', params: { letterId: letter.letter }}">{{letter.letter}}</at-menu-item>
          </at-menu>
        </header>
        <router-view :key="$route.path" class="view"></router-view>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import styles from '@/shared/js/styles';

export default {
  name: 'app',
  created() {
      this.$store.dispatch("collection/get");
  },
  computed: {
    ...mapGetters('collection', {collection: 'collection', loading: 'loading'})
  }
}
</script>

<style lang="postcss" scoped>
  header {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
  }
  .view {
    margin-top: 50px;
  }
</style>
