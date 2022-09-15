<template>
  <div id="app" @click="play">
    <audio ref="musicBg" src="./assets/audio/bg.wav" loop></audio>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App', 

  data() {
    return {
      isPlayNow: this.$store.getters.getIsPlay
    }
  },

  computed: {
    isApp() {
      return navigator.userAgent.indexOf('App/SyBird') > -1
    },

    isPlay() {
      return this.$store.getters.getIsPlay
    },

    isRecover() {
      return this.$store.getters.getIsRecover
    }
  },

  mounted() {
    if (this.isApp) {
      this.play()
      // this.$store.dispatch('setIsPlay', true)
    }

    document.addEventListener("visibilitychange", () => {
      if(document.hidden) {
        console.log('-=-=-=-=进去后台', this.isPlay)
        if (this.isPlay) {
          this.$refs.musicBg.pause()
          this.$store.dispatch('setIsPlay', false)
          this.$store.dispatch('setIsRecover', true)
        }
      } else {
        console.log('-=-=-=-=进去前台', this.isRecover)
        if (this.isRecover) {
          this.$refs.musicBg.play()
          this.$store.dispatch('setIsPlay', true)
          this.$store.dispatch('setIsRecover', false)
        }
      }
    })
  },

  methods: {
    play() {
      if (!this.isPlayNow) {
        this.$refs.musicBg.play()
        this.isPlayNow = true
        this.$store.dispatch('setIsPlay', true)
      }
    }
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
