<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import util from './util/util'

export default {
  name: 'App', 

  data() {
    return {}
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  height: 100vh;
}
</style>
