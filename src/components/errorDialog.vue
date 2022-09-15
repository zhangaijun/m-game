<template>
  <div class="error-dialog">
    <Dialog :show="show">
      <p class="info-text">{{text}}</p>

      <div class="info-btn" @click="confirm">
        <img class="btn-bg" src="../assets/imgs/common/big_btn.png" />
        <span class="btn-text">确定</span>
      </div>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './dialog.vue'

export default {
  name: 'ErrorDialog',

  props: {
    show: {
      type: Boolean,
      default: false
    },

    text: {
      type: String,
      default: ''
    }
  },

  components: {
    [Dialog.name]: Dialog
  },

  data() {
    return {

    }
  },

  methods: {
    confirm() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss">
.error-dialog {
  position: absolute;
  z-index: 9999;

  .info-text {
    position: relative;
    margin: 0;
    padding-top: 50px;
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
</style>