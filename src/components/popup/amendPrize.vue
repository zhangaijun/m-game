<template>
  <div>
    <van-popup
        class="popup"
        v-model="show"
        :close-on-click-overlay="false"
    >
      <div class="popup-content">
        <div class="popup-content-close" @click="handleClose"></div>
        <div class="popup-content-title">
          填写信息
        </div>
        <div class="popup-inputGroup">
          <div class="popup-inputGroup-position">
            <input class="popup-inputGroup-input" type="text" name="name" v-model="userInfo.name">
            <div class="popup-inputGroup-position-text">姓名：</div>
          </div>
          <div class="popup-inputGroup-position">
            <input class="popup-inputGroup-input input1" type="text" name="tel" v-model="userInfo.tel">
            <div class="popup-inputGroup-position-text">手机号：</div>
          </div>
          <div class="popup-inputGroup-position">
            <textarea class="popup-inputGroup-text" cols="" type="text" v-model="userInfo.address"></textarea>
            <div class="popup-inputGroup-position-text">邮寄地址：</div>
          </div>
          <!-- <div class="popup-inputGroup-position">
            <input class="popup-inputGroup-input input2" type="text" name="tel" v-model="userInfo.address">
            <div class="popup-inputGroup-position-text">详细地址：</div>
          </div> -->
        </div>
        <div class="popup-content-btn" @click="handleConfirm">
          提交
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showSelect" position="bottom">
      <van-area
        title="请选择"
        :area-list="areaList"
        @confirm="onConfirm"
        @cancel="showSelect = false"
      />
    </van-popup>
    <ErrorDialog :show.sync="errorShow" :text="errorText"></ErrorDialog>
  </div>
</template>

<script>
import ErrorDialog from '../errorDialog.vue' 
import { areaList } from '@vant/area-data'
import * as request from '../../api/service/game'
import { Toast } from 'vant'

export default {
  name: "AmendPrize",
  components: {
    [ErrorDialog.name]: ErrorDialog
  },
  data() {
    return {
      errorShow: false,
      errorText: '',
      showSelect: false,
      userInfo:{
        name:'',
        tel:'',
        area: '',
        address:'',
      },
      areaList: areaList,
      isSubmit: false
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    recordId: {
      type: Number,
      default: null
    }
  },
  methods:{
    init(){
      this.userInfo = JSON.parse(JSON.stringify(this.amendPrizeData))
    },
    handleClose(){
      this.userInfo = {
        name:'',
        tel:'',
        area: '',
        address:'',
      }
      this.$emit('update:show', false)
    },
    handleConfirm(){
      if (!this.userInfo.name) {
        this.errorText = '请填写姓名'
        this.errorShow = true
        return
      }

      if (!this.userInfo.tel) {
        this.errorText = '请填写手机号'
        this.errorShow = true
        return
      }

      if (this.userInfo.tel.length != 11 || this.userInfo.tel.length === 11 && !/^1[3456789]\d{9}$/.test(this.userInfo.tel)) {
        this.errorText = '请填写正确格式手机号'
        this.errorShow = true
        return
      }

      if (!this.userInfo.address) {
        this.errorText = '请填写邮寄地址'
        this.errorShow = true
        return
      }
      
      if (this.isSubmit) return

      const params = {
        recordId: this.recordId,
        name: this.userInfo.name,
        mobile: this.userInfo.tel,
        address: this.userInfo.address
      }
      request.claim(params).then(res => {
        if (!res.data.success) {
          Toast({
            message: res.data.error,
            position: 'top',
            className: 'toast-class',
          })
          return
        }
        
        Toast({
          message: '提交成功，我们将尽快为您安排发货',
          position: 'top',
          className: 'toast-class',
        })
        this.$emit('update:show', false)
        this.isSubmit = true
        // 返回到模式页
        this.$router.go(-5)
      }).catch(() => {
        Toast({
          message: '网络异常，请稍后重试',
          position: 'top',
          className: 'toast-class',
        })
      }) 
    },
    onConfirm(data){
      console.log(data)
      this.userInfo.area = data.map(item => item.name).join('/')
      this.showSelect = false
    }
  }
}
</script>

<style lang="scss" scoped>
.popup{
  width: 579px;
  height: 718px;
  padding-top: 40px;
  background:rgba(255,255,255,0);

  &-content{
    position: relative;
    width: 579px;
    height: 677px;
    background: url("../../assets/popup/popup3.png") no-repeat;
    background-size: 579px 677px;
    font-size: 32px;
    color: #fff;
    padding: 10%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-close{
      position: absolute;
      right: 12px;
      top: -30px;
      width: 46px;
      height: 46px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-title{
      width: 100%;
      height: 20%;
      font-size: 0.8rem;
      color: #8AE1FF;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-btn{
      width: 317px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  &-inputGroup{
    z-index: 100;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-position{
      position: relative;
      width: 94%;
      height: 78px;
      margin-bottom: 10px;
      &-text{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 14px;
        font-size: 24px;
        color: #fff;
      }
    }
    &-input{
      width: 100%;
      height: 100%;
      border: #31AAE2 1px solid;
      background-color: rgba(0,0,0,0);
      font-size: 24px;
      color: #fff;
      padding: 0 14px 0 74px;
    }
    &-text{
      width: 100%;
      height: 160px;
      border: #31AAE2 1px solid;
      background-color: rgba(0,0,0,0);
      font-size: 24px;
      line-height: 48px;
      color: #fff;
      padding: 14px 14px 14px 128px;
    }

    .input1 {
      padding-left: 100px;
    }

    .input2 {
      padding-left: 125px;
    }
  }
}

.toast-class {
  background: #FEFFFF;
  color: #333;
  font-size: 30px;
  line-height: 40px;  
}


::v-deep .van-popup{
  // font-size: 11px;
  background:rgba(255,255,255,0);
}

::v-deep .van-picker__cancel {
  font-size: 32px;
}

::v-deep .van-picker__title {
  font-size: 32px;
  line-height: 40px;
}

::v-deep .van-picker__confirm {
  font-size: 32px;
}
</style>
