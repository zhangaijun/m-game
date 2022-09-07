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

  .content {
    position: relative;
    width: 750px;
    height: 753px;
    padding: 160px 150px 210px 160px;

    .content-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 750px;
    }
  }
}
</style>