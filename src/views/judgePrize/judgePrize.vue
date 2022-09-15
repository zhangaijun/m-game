<template>
  <div class="judge">
    <NavigationBar :isBack="false" @goBack="goBack" />
    <PlayIcon />
    <div class="judge-title">
      <div class="judge-title-top">《智慧生活启示录》</div>
      <div class="judge-title-btm">终极密卷</div>
    </div>
    <div class="judge-content">
      <div class="judge-content-bg">
        没玩够？立即预约探店打本三翼鸟沉浸式剧本游戏《智慧生活启示录》，争夺四维世界唯一名额，还能收获精美智慧家好礼
      </div>
    </div>
    <div class="judge-inputGroup">
      <div class="judge-inputGroup-position">
        <input class="judge-inputGroup-input" type="text" name="name" v-model="userInfo.name">
        <div class="judge-inputGroup-position-text">姓名：</div>
      </div>
      <div class="judge-inputGroup-position">
        <input class="judge-inputGroup-input input2" type="text" name="tel" v-model="userInfo.tel">
        <div class="judge-inputGroup-position-text">手机号：</div>
      </div>
      <div class="judge-inputGroup-position"  @click="show = true">
        <input class="judge-inputGroup-input input1" readonly type="text" v-model="userInfo.mdName">
        <div class="judge-inputGroup-position-text">预约门店：</div>
      </div>
    </div>
    <div class="judge-button">
      <div class="judge-button-center" @click="handleConfirm">立即预约</div>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="popup-title">
        <span class="title-left">城市</span>
        <span class="title-middle">门店</span>
        <span class="title-right" @click="show = false">确定</span>
      </div>
      <van-tree-select
        :items="items"
        :main-active-index.sync="activeIndex"
        @click-nav="chooseIndex"
      >
        <div slot="content" class="md-detail" v-for="item in address" :key="item.id" @click="chooseItem(item)">
          <div class="content-left">
            <p class="md-name">{{ item.shopName }}</p>
            <div class="md-address">
              <img class="address-icon" src="../../assets/imgs/common/position.png" />
              <span class="address-text">{{ item.shopAddress }}</span>
            </div>
          </div>
          
          <div class="content-right">
            <van-icon v-show="shopId === item.id" name="success" />
          </div>
        </div>
      </van-tree-select>
    </van-popup>
    <ErrorDialog :show.sync="errorShow" :text="errorText"></ErrorDialog>
  </div>
</template>

<script>
import ErrorDialog from '../../components/errorDialog.vue' 
import NavigationBar from '../../components/navigationBar.vue'
import PlayIcon from '../../components/playIcon.vue'
import * as request from '../../api/service/game'
import { Toast } from 'vant'

export default {
  name: "judgePrize",
  components: {
    [NavigationBar.name]: NavigationBar,
    [ErrorDialog.name]: ErrorDialog,
    PlayIcon
  },
  data(){
    return{
      errorShow: false,
      errorText: '',
      userInfo:{
        name:'',
        tel:'',
        mdName:'',
      },
      address: [],
      activeIndex: null,
      cityId: null,
      shopId: null,
      show:false,
      items: [],
      isSubmit: false
    }
  },
  mounted() {
    this.findCity()
  },
  methods:{
    goBack() {
      // this.$router.push('/center')
      // 返回到模式页
      if (this.$route.query.isOver) {
        this.$router.go(-5)
      } else if (this.$route.query.isEnding) {
        this.$router.go(-7)
      } else {
        this.$router.go(-6)
      }
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

      if (!this.userInfo.mdName) {
        this.errorText = '请选择门店'
        this.errorShow = true
        return
      }

      if (this.isSubmit) return

      const params = {
        cityId: this.cityId,
        shopId: this.shopId,
        memberId: this.$store.getters['getUserId'],
        name: this.userInfo.name,
        mobile: this.userInfo.tel
      }
      request.saveSubscribe(params).then(res => {
        if (!res.data.success) {
          Toast({
            message: res.data.error,
            position: 'top',
            className: 'toast-class',
          })
          return
        }
        
        Toast({
          message: '预约成功!',
          position: 'top',
          className: 'toast-class',
        })
        this.isSubmit = true
        this.goBack()
      }).catch(() => {
        Toast({
          message: '网络异常，请稍后重试',
          position: 'top',
          className: 'toast-class',
        })
      }) 
    },

    findCity() {
      request.findCity().then(res => {
        if (!res.data.success) {
          Toast({
            message: res.data.error,
            position: 'top',
            className: 'toast-class'
          })
          return
        }
        
        this.items = []
        res.data.result.forEach(item => {
          this.items.push({
            text: item.cityName,
            id: item.id,
            className: 'md-area'
          })
        })
        this.cityId = this.items[0].id
        this.findShop()
      }).catch(() => {
        Toast({
          message: '网络异常，请稍后重试',
          position: 'top',
          className: 'toast-class',
        })
      }) 
    },

    chooseIndex(index) {
      this.cityId = this.items[index].id
      this.findShop()
    },  

    findShop() {
      request.findShop({ cityId: this.cityId }).then(res => {
        if (!res.data.success) {
          Toast({
            message: res.data.error,
            position: 'top',
            className: 'toast-class',
          })
          return
        }
        
        this.address = res.data.result
      }).catch(() => {
        Toast({
          message: '网络异常，请稍后重试',
          position: 'top',
          className: 'toast-class',
        })
      }) 
    },

    chooseItem(item) {
      this.shopId = item.id
      this.userInfo.mdName = item.shopName
    }
  }
}
</script>

<style lang="scss">
.judge {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  overflow: hidden;
  background: url("../../assets/imgs/game/bg_2.png") no-repeat;
  background-size: 100% 100%;

  &-title{
    width: 100%;
    text-align: center;
    &-hide{
      height: 30px;
      font-size: 16px;
      color: #FFF;
      margin-bottom: 2px;
    }
    &-top{
      font-size: 26px;
      color: #93FFFF;
      margin-bottom: 2px;
    }
    &-btm{
      font-size: 50px;
      color: #93FFFF;
      font-weight: 500;
    }
  }
  &-content{
    position: relative;
    background: url("../../assets/pageGround/page7.png") no-repeat;
    background-size: 100% 100%;
    width: 750px;
    height: 640px;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 80px;

    &-bg{
      background: url("../../assets/pageGround/page8.png") no-repeat;
      background-size: 100% 100%;
      width: 660px;
      height: 560px;
      color: #fff;
      font-size: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 56px;
      padding: 0 105px 0 120px;
      // text-align: center;
    }
  }

  &-inputGroup{
    margin-top: 60px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-position{
      position: relative;
      width: 540px;
      height: 70px;
      margin-bottom: 4px;
      &-text{
        position: absolute;
        top: 0;
        left: 14px;
        font-size: 24px;
        line-height: 70px;
        color: #FFFFFF;
      }
    }
    &-input{
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: #31AAE2 1px solid;
      background-color: rgba(0,0,0,0);
      font-size: 24px;
      line-height: 70px;
      color: #FFFFFF;
      padding: 0 14px 0 74px;
    }

    .input1 {
      padding-left: 125px;
    }

    .input2 {
      padding-left: 100px;
    }
  }

  &-button{
    width: 100%;
    margin: 100px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #FFFFFF;
    height: 20%;
    text-shadow: hotpink 2px 0 0 ;
    &-center{
      width: 250px;
      height: 86px;
      line-height: 86px;
      text-align: center;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .popup-title {
    display: flex;
    padding: 20px;

    .title-left {
      display: block;
      width: 250px;
      font-size: 32px;
      line-height: 50px;
    }

    .title-middle {
      display: block;
      flex: 1;
      font-size: 32px;
      line-height: 50px;
    }

    .title-right {
      display: block;
      width: 100px;
      font-size: 32px;
      line-height: 50px;
      text-align: right;
      color: #576b95;
    }
  }

  .van-tree-select {
    .md-area {
      position: relative;
      padding: 20px;
      font-size: 30px;
      line-height: 50px;

      &::before {
        position: absolute;
        width: 4px;
        height: 50px;
        background: #31AAE2;
      }
    }

    .md-detail {
      padding: 20px 30px;
      display: flex;
      align-items: center;

      .content-left {
        padding-right: 40px;
        
        .md-name {
          margin: 0;
          padding-left: 50px;
          font-size: 24px;
          line-height: 30px;
        }

        .md-address {
          padding-top: 12px;
          display: flex;
          align-items: center;

          .address-icon {
            width: 30px;
            height: 30px;
          }

          .address-text {
            display: block;
            padding-left: 20px;
            font-size: 24px;
            line-height: 30px;
          }
        }
      }

      .content-right {
        width: 40px;
        height: 30px;
      }

      .van-icon-success {
        font-size: 30px;
        color: #31AAE2;
      }
    }
  }
}

.toast-class {
  background: #FEFFFF;
  color: #333;
  font-size: 30px;
  line-height: 40px;  
}

::v-deep .van-picker__toolbar{
  padding: 10px;
  height: 10%;
}

::v-deep  .van-picker__toolbar button{
  font-size: 0.5rem;
}

::v-deep  .van-ellipsis{
  font-size: 16px;
}
</style>
