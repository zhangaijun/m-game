<template>
  <div class="wait">
    <NavigationBar :isBack="false" @goBack="goBack" />
    <PlayIcon />
    <div class="wait-title">
      <div class="wait-title-top">《智慧生活启示录》</div>
      <div class="wait-title-btm">终极密卷</div>
    </div>
    <div class="wait-time">
      <img class="time-bg" src="../../assets/imgs/game/title_bg.png" />
      <span class="time-left">拥护AI阵营</span>
      <span class="time-content"></span>
      <span class="time-right">反AI阵营</span>
    </div>
    <div class="wait-picStyle">
      <div class="wait-picStyle-lft">{{ prosScore }}</div>
      <div class="wait-picStyle-center"></div>
      <div class="wait-picStyle-rgt">{{ consScore }}</div>
    </div>
    <div :class="['wait-content', prosList.length === 1 && 'wait-content-small']">
      <div :class="[prosScore > consScore && 'wait-content-victory', prosScore < consScore && 'wait-content-victory2', prosScore == consScore && 'wait-content-victory3']"></div>
      <div :class="['wait-content-lft', prosScore < consScore && 'wait-content-lft2']">
        <img :class="['wait-content-lft-bg', prosScore < consScore && 'wait-content-lft2-bg']" src="../../assets/pageGround/bgBlue.png" />
        <div :class="['wait-content-lft-pic', `pic${index + 1}`]" v-for="(item, index) in prosList" :key="item.memberId">
          <div class="wait-content-img">
            <img class="wait-content-img-bg" src="../../assets/imgs/game/img_bg_1.png" />
            <img class="wait-content-img-img" :src="require('@/assets/imgs/game/pros_img_'+ item.avatar +'.jpg')">
          </div>
          <div class="grades">
            <div class="wait-content-lft-pic-name">{{item.memberName}}</div>
            <div class="wait-content-lft-pic-grade">{{item.score}}</div>
          </div>
        </div>
      </div>
      <div :class="['wait-content-rgt', prosScore <= consScore && 'wait-content-rgt2']">
        <img :class="['wait-content-rgt-bg', prosScore <= consScore && 'wait-content-rgt2-bg']" src="../../assets/pageGround/bgYellow.png" />
        <div :class="['wait-content-rgt-pic', `pic${index + 4}`]" v-for="(item, index) in consList" :key="item.memberId">
          <div class="wait-content-img">
            <img class="wait-content-img-bg" src="../../assets/imgs/game/img_bg_1.png" />
            <img class="wait-content-img-img" :src="require('@/assets/imgs/game/cons_img_'+ item.avatar +'.jpg')">
          </div>
          
          <div class="grades">
            <div class="wait-content-lft-pic-name">{{item.memberName}}</div>
            <div class="wait-content-lft-pic-grade">{{item.score}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="wait-button" v-if="mode === '0'">
      <div class="wait-button-sure" @click="handConfirm">确定</div>
    </div>

    <div class="wait-bottom" v-if="mode === '1'">
      <!-- <p class="bottom-title">答题小能手，送你一份好礼<br>点击抽奖领取吧</p>
      <img class="bottom-img" src="../../assets/imgs/lottery/img.png" /> -->
      <div class="bottom-button" @click="toLottery">
        <img class="button-bg" src="../../assets/imgs/common/big_btn.png" />
        <span class="button-text">点击抽奖</span>
      </div>
      <!-- <p class="bottom-info">  三翼鸟沉浸式剧本游戏<br>《智慧生活启示录》火爆征集<br>到店打本享XXX福利<br>快来体验吧！</p> -->
      <img class="reserve-btn" src="../../assets/imgs/lottery/button.png" @click="toReserve" />
    </div>
  </div>
</template>

<script>
import NavigationBar from '../../components/navigationBar.vue'
import PlayIcon from '../../components/playIcon.vue'
import * as request from '../../api/service/game'

export default {
  name: "gameOver",
  components:{NavigationBar, PlayIcon},
  data(){
    return{
      mode: this.$route.query.mode,
      prosScore: 0,
      consScore: 0,
      consList: this.$store.getters.getConsList, // 反对阵营
      prosList: this.$store.getters.getProsList, // 拥护阵营
    }
  },
  mounted() {
    if (this.$route.query.roomId) this.getLastScore()
    if (this.$route.query.record) this.findRecentRecord()
  },
  methods:{
    goBack() {
      if (this.$route.query.record) {
        this.$router.go(-1)
        return
      }
      
      if (this.mode === '0') {
        this.$router.go(-5)
      } else {
        this.$router.go(-4)
      }
    },

    getLastScore() {
      request.getLastScore({roomId: this.$route.query.roomId}).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }
        
        const data = res.data.result
        this.prosScore = data.prosScore
        this.consScore = data.consScore
        data.memberScoreList.forEach(item => {
          const list1 = this.prosList.filter(it => it.memberId === item.memberId)
          const list2 = this.consList.filter(it => it.memberId == item.memberId)
          if (!list1.length && !item.type) {
            const imgList = this.prosList.map(item => item.avatar)
            const prosImg = [1, 2, 3].filter(item => !imgList.includes(item))
            this.prosList.push({
              memberId: item.memberId,
              memberName: item.memberName,
              type: item.type,
              roomId: item.roomId,
              avatar: prosImg[0],
              score: item.score
            })
          }
          if (!list2.length && item.type) {
            const imgList = this.consList.map(item => item.avatar)
            const consImg = [1, 2, 3].filter(item => !imgList.includes(item))
            this.consList.push({
              memberId: item.memberId,
              memberName: item.memberName,
              type: item.type,
              roomId: item.roomId,
              avatar: consImg[0],
              score: item.score
            })
          }

          this.consList.forEach(child => {
            if (item.memberId === child.memberId) this.$set(child, 'score', item.score)
          })
          this.prosList.forEach(child => {
            if (item.memberId === child.memberId) this.$set(child, 'score', item.score)
          })
        })
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })
    },

    findRecentRecord() {
      request.findRecentRecord({memberId: this.$store.getters['getUserId']}).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }

        const data = res.data.result
        this.prosScore = data.prosScore
        this.consScore = data.consScore
        this.consList = []
        this.prosList = []
        data.memberScoreList.forEach(item => {
          if (item.type) {
            item.avatar = this.consList.length + 1
            this.consList.push(item)
          } else {
            item.avatar = this.prosList.length + 1
            this.prosList.push(item)
          }
        })
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })
    },

    handConfirm(){
      this.$router.push('/ending')
    },

    toLottery() {
      this.$router.push({
        path: '/lottery',
        query: {
          roomId: this.$route.query.roomId
        }
      })
    },

    toReserve() {
      this.$router.push({
        path: '/judgePrize',
        query: {
          isOver: true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wait {
  width: 100%;
  min-height: 100vh;
  background: url("../../assets/imgs/game/bg_2.png") no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  overflow: hidden;

  .wait-time {
    position: relative;
    padding: 60px 100px 0 100px;
    display: flex;

    .time-bg {
      position: absolute;
      top: 60px;
      left: 20px;
      width: 710px;
    }

    .time-left {
      display: inline-block;
      padding: 40px 0;
      font-size: 27px;
      line-height: 40px;
      color: #CFFBFF;
    }

    .time-content {
      display: inline-block;
      width: 280px;
      padding: 0 60px;
      font-size: 47px;
      line-height: 68px;
      font-weight: 600;
      color: #fff;
    }

    .time-right {
      display: inline-block;
      padding: 40px 0;
      font-size: 27px;
      line-height: 40px;
      color: #FFF10E;
    }
  }
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
  &-picStyle {
    transform: translateY(-20%);
    width: 68%;
    height: 80px;
    background: url("../../assets/expand/expand1.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &-lft{
      position: relative;
      color: #fff;
      font-size: 36px;
    }
    &-center{
      width: 60px;
      height: 60px;
      margin: 0 30px;
      background: url("../../assets/icon/start.png") no-repeat;
      background-size: 100% 100%;
    }
    &-rgt{
      color: #fff;
      font-size: 36px;
    }
  }

  .wait-content {
    position: relative;
    width: 100%;
    height: 720px;
    margin-top: 70px;
    font-size: 16px;
    color: #FFFFFF;
    display: flex;

    .wait-content-victory {
      width: 280px;
      height: 157px;
      position: absolute;
      top: -72px;
      left: 90px;
      background: url("../../assets/textIcon/victory.png") no-repeat;
      background-size: 100% 100%;
      z-index: 2;
    }

    .wait-content-victory2 {
      width: 280px;
      height: 157px;
      position: absolute;
      top: -72px;
      right: 40px;
      background: url("../../assets/textIcon/victory.png") no-repeat;
      background-size: 100% 100%;
      z-index: 2;
    }

    .wait-content-victory3 {
      width: 280px;
      height: 140px;
      position: absolute;
      top: -72px;
      left: 240px;
      background: url("../../assets/textIcon/draw.png") no-repeat;
      background-size: 100% 100%;
      z-index: 2;
    }

    .wait-content-lft {
      position: relative;
      height: 720px;
      width: 375px;
      padding-top: 100px;
      z-index: 1;

      .wait-content-lft-bg {
        position: absolute;
        top: 0px;
        left: -80px;
        width: 560px;
      }

      .wait-content-lft2-bg {
        top: 50px;
      }
    }

    .wait-content-lft2 {
      padding-top: 160px;
      z-index: 0;
    }

    .wait-content-rgt {
      position: relative;
      height: 720px;
      width: 375px;
      padding-top: 200px;
      z-index: 1;

      .wait-content-rgt-bg {
        position: absolute;
        top: -30px;
        right: -80px;
        width: 580px;
      }

      .wait-content-rgt2-bg {
        top: -100px;
      }
    }

    .wait-content-rgt2 {
      padding-top: 110px;
      z-index: 1;
    }

    .wait-content-lft-pic, .wait-content-rgt-pic {
      display: flex;
      width: 300px;
      margin-bottom: 14px;

      .wait-content-img {
        position: relative;
        width: 140px;
        height: 137px;
        z-index: 3;

        .wait-content-img-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 140px;
        }

        .wait-content-img-img {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 100px;
          border-radius: 50%;
        }
      }

      .grades{
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 240px;
        z-index: 1;

        .wait-content-lft-pic-name {
          font-size: 24px;
          text-align: right;
          padding-right: 30px;
        }

        .wait-content-lft-pic-grade {
          width: 240px;
          height: 69px;
          padding-right: 80px;
          line-height: 76px;
          z-index: 20;
          text-align: right;
          font-size: 36px;
          background: url("../../assets/pageGround/bgGrade.png") no-repeat;
          background-size: 278px 69px;
          background-position: -52px;
        }
      }
    }

    .pic1{
      transform: translateX(70px);
    }
    .pic2{
      transform: translateX(40px);
    }
    .pic3{
      transform: translateX(0.133rem);

    }
    .pic4{
      transform: translateX(80px);
    }
    .pic5{
      transform: translateX(50px);
    }

    .pic6{
      transform: translateX(20px);
    }
  }

  .wait-content-small {
    height: 350px;

    .wait-content-lft {
      position: relative;
      height: 300px;
      width: 375px;
      padding-top: 90px;
      z-index: 1;

      .wait-content-lft-bg {
        position: absolute;
        top: 22px;
        left: -80px;
        width: 560px;
        height: 300px;
      }

      .wait-content-lft2-bg {
        top: 50px;
      }
    }

    .wait-content-lft2 {
      padding-top: 120px;
      z-index: 0;
    }

    .wait-content-rgt {
      position: relative;
      height: 300px;
      width: 375px;
      padding-top: 138px;
      z-index: 1;

      .wait-content-rgt-bg {
        position: absolute;
        top: 20px;
        right: -80px;
        width: 580px;
        height: 328px;
      }

      .wait-content-rgt2-bg {
        top: -20px;
      }
    }

    .wait-content-rgt2 {
      padding-top: 88px;
      z-index: 1;
    }

    .pic1{
      transform: translateX(24px);
    }

    .pic4{
      transform: translateX(50px);
    }
  }

  &-button{
    width: 100%;
    padding-bottom: 40px;
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #FFFFFF;
    text-shadow: hotpink 2px 0 0 ;

    &-sure{
      width: 310px;
      height: 90px;
      line-height:  90px;
      text-align: center;
      background: url("../../assets/button/button1.png") no-repeat;
      background-size: 100% 100%;
    }
  }

  .wait-bottom {
    padding: 40px 80px 80px 80px;
    display: flex;
    // flex-direction: column;
    // justify-content: center;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .bottom-title {
      margin: 0;
      font-size: 33px;
      line-height: 40px;
      color: #66FFFF;
      text-align: center;
    }

    .bottom-img {
      margin: 28px 0 36px 0;
      width: 153px;
    }

    .bottom-button {
      position: relative;
      width: 270px;
      height: 70px;

      .button-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 270px;
        height: 70px;
      }

      .button-text {
        position: relative;
        display: block;
        font-size: 36px;
        text-align: center;
        line-height: 73px;
        color: #fff;
      }
    }

    .bottom-info {
      margin: 0;
      padding: 36px 0 14px 0;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      color: #fff;
    }

    .reserve-btn {
      // height: 70px;
      width: 260px;
    }
  }
}
</style>
