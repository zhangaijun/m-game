<template>
  <div class="ending-page">
    <img class="bg" src="../../assets/imgs/game/bg_2.png" />
    <NavigationBar :isBack="false" @goBack="goBack" />
    <PlayIcon />
    <div class="title">
      <p class="title-top">《智慧生活启示录》</p>
      <p class="title-bottom">终极密卷</p>
    </div>
    <Dialog :show="true">
      <p class="info-text">短暂的体验已经结束~<br>
        点击预约，Get四维世界同款智慧家生活吧！
      </p>

      <div class="info-btn" @click="confirm">
        <img class="btn-bg" src="../../assets/imgs/common/big_btn.png" />
        <span class="btn-text">立即预约</span>
      </div>
    </Dialog>
  </div>
</template>

<script>
import NavigationBar from '../../components/navigationBar.vue'
import Dialog from '../../components/dialog.vue'
import PlayIcon from '../../components/playIcon.vue'

export default {
  name: 'Ending',

  components: {
    [NavigationBar.name]: NavigationBar,
    [Dialog.name]: Dialog,
    PlayIcon
  },

  data() {
    return {

    }
  },

  methods: {
    goBack() {
      // this.$router.push('/center')
      // 返回到模式页
      this.$router.go(-6)
    },

    confirm() {
      this.$router.push({
        path: '/judgePrize',
        query: {
          isEnding: true
        }
      })
    }
  }
}
</script>

<style lang="scss">
.ending-page {
  position: relative;
  width: 750px;
  padding-top: 100px;
  height: 100%;
  overflow: hidden;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
    min-height: 100vh;
  }

  .navigation-bar {
    z-index: 2;
  }

  .title {
    position: relative;
    z-index: 1;

    .title-top {
      margin: 0;
      font-size: 26px;
      line-height: 40px;
      text-align: center;
      font-weight: 600;
      color: #93FFFF;
    }

    .title-bottom {
      margin: 0;
      font-size: 50px;
      line-height: 77px;
      text-align: center;
      font-weight: 600;
      color: #93FFFF;
    }
  }

  .dialog {
    z-index: 0;
    background: transparent;
    .info-text {
      position: relative;
      margin: 0;
      padding-top: 40px;
      height: 180px;
      font-size: 33px;
      line-height: 40px;
      text-align: center;
      font-weight: 600;
      color: #fff;
    }

    .info-btn {
      position: relative;
      width: 387px;
      height: 94px;
      margin: 60px auto 0 auto;

      .btn-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 387px;
      }

      .btn-text {
        position: relative;
        display: block;
        font-size: 32px;
        line-height: 92px;
        text-align: center;
        color: #fff;
      }
    }
  }
}
</style>