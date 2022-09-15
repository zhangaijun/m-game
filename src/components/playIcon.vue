<template>
  <img :class="['play-icon', isPlay && 'play-rotate']" src="../../src/assets/imgs/common/play.png" @click="changPlay" />
</template>

<script>
export default {
  name: 'PlayIcon',

  computed: {
    isPlay() {
      return this.$store.getters.getIsPlay
    },

    isRecover() {
      return this.$store.getters.getIsRecover
    }
  },

  methods: {
    play() {
      this.$parent.$parent.$refs.musicBg.play()
      this.$store.dispatch('setIsPlay', true)
    },

    pause() {
      this.$parent.$parent.$refs.musicBg.pause()
      this.$store.dispatch('setIsPlay', false)
    },

    changPlay() {
      if (!this.isPlay) {
        this.play()
      } else {
        this.pause()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.play-icon {
  position: absolute;
  top: 120px;
  right: 50px;
  width: 82px;
  z-index: 999;
}

.play-rotate {
  animation: myRotate 10s linear infinite;
}

@keyframes myRotate{
  0%{ -webkit-transform: rotate(0deg);}
  50%{ -webkit-transform: rotate(180deg);}
  100%{ -webkit-transform: rotate(360deg);}
}
</style>