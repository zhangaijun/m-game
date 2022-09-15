<template>
  <div>
    <van-popup
        class="popup"
        v-model="show"
        :overlay="false"
    >
      <div class="popup-content">
        <div class="popup-content-title" v-if="type.title">
          {{type.title || ''}}
        </div>
        <template v-if="type.input">
          <input type="text" v-model="inputText" @change="handleChange" class="popup-content-input" placeholder="在此输入房间号" />
          <p class="popup-content-info">房间号为四位数字</p>
        </template>
        
        <div class="popup-content-text">
          <div v-if="type.text.length>0">
            <div v-for="(item,index) in type.text" :key="index">
              {{item}}
            </div>
          </div>
        </div>
        <div class="popup-content-btn" @click="handleConfirm" v-if="type.btnText">
          {{type.btnText || ''}}
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "popupFlowPath",
  data() {
    return {
      inputText:''
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: Object,
      default: {}
    }
  },
  methods:{
    handleClose(){
      this.$emit('handleHidden')
    },
    handleConfirm(){
      this.$emit('handleConfirm',{inputText:this.inputText,type:this.type.pageState})
    },
    handleChange(e) {
      let reg = /^[0-9]{4}/
      const inputText = this.inputText.match(reg)
      this.inputText = inputText ? (inputText.length ? inputText[0] : '') : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.popup{
  width: 96%;
  background:rgba(255,255,255,0);
  padding: 20px;
  box-sizing: border-box;
  &-content{
    position: relative;
    width: 100%;
    height: 550px;
    background: url("../../assets/popup/popup4.png") no-repeat;
    background-size: 100% 100%;
    font-size: 32px;
    color: #fff;
    padding: 10%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    &-title{
      width: 100%;
      height: 40%;
      padding-top: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
      color: #86dcee;
      //text-shadow: #68baba 0.4px 0 0;
      font-weight: 600;
    }
    &-input{
      width: 76%;
      height: 65px;
      padding: 20px;
      background-color: rgba(5,40,82,0.7);
      text-align: center;
      color: #86dcee;
      border: #00E4FF solid 1px;
    }
    &-info {
      margin: 0;
      padding-top: 20px;
      font-size: 24px;
      text-align: center;
      color: #a2c2ec;
    }
    &-text{
      width: 100%;
      flex: 1;
      padding: 0 40px;
      text-align: center;
    }
    &-btn{
      width: 70%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size:100% 100%;
    }
  }
}

::v-deep .van-popup{
  font-size: 11px;
  background:rgba(255,255,255,0);
}
</style>
