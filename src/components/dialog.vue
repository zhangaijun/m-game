<template>
  <div class="dialog" v-if="show">
    <div class="content">
      <img class="content-bg" src="../assets/imgs/common/content_bg.png" />

      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5,40,82,0.7);

  .content {
    position: relative;
    width: 650px;
    height: 526px;
    padding: 80px 100px 110px 110px;

    .content-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 650px;
    }
  }
}
</style>