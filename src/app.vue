<template>
  <div class="app">
      And so it begins
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
      // get all data
      this.$store.dispatch("collection/get");
  }
}
</script>

<style scoped>
.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 100%;
}
</style>
