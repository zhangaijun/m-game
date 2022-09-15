<template>
  <div class="navigation-bar">
    <img class="back" src="../assets/imgs/common/back.png" @click="goback" />
    <img v-if="showShare" class="share" src="../assets/imgs/common/share.png" @click="share" />
  </div>
</template>

<script>
import UplusApi from '@uplus/uplus-api'

const instance = new UplusApi()
instance.initDeviceReady()

export default {
  name: 'NavigationBar',

  props: {
    showShare: {
      type: Boolean,
      default: true
    },

    isBack: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {}
  },

  methods: {
    goback() {
      if (this.isBack) this.$router.back()
      this.$emit('goBack')
    },

    share() {
      instance.initDeviceReady().then(() => {
        console.log('process.NODE_ENV-=-=-=-=-=', process.NODE_ENV)
        instance.upShareModule.showShareView({
          // platformType: 'QQ',
          title: '三翼鸟智慧生活启示录',
          desc: '原创剧本全网首发，科技style剧本游戏来了',
          url: process.NODE_ENV !== 'production' ? 'https://yx.rrskjfw.com.cn/' : 'https://syn.rrskjfw.com.cn/',
          thumImage: 'https://rrskj.oss-cn-qingdao.aliyuncs.com/syn/img.png',
          shareType: 'webPage',
          image: '',
        }).then((result) => {
          console.log(result)
        }).catch(e => { console.log(e) })
      }).catch(e => { console.log(e) })
    }
  }
}
</script>

<style lang="scss">
.navigation-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 750px;
  height: 80px;
  margin-top: 20px;
  padding: 0 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 999;

  img {
    width: 80px;
    height: 80px;
  }
}
</style>