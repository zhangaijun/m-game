<template>
  <div class="lottery-page">
    <img class="bg" src="../../assets/imgs/game/bg_2.png" />
    <NavigationBar :isBack="false" @goBack="goBack" />
    <PlayIcon />
    <div class="title">
      <p class="title-top">《智慧生活启示录》</p>
      <p class="title-bottom">终极密卷</p>
    </div>

    <img class="text1" src="../../assets/imgs/lottery/text1.png" />
    <img class="text2" src="../../assets/imgs/lottery/text2.png" />

    <div class="content">
      <img class="content-bg" src="../../assets/imgs/lottery/content_bg.png" />
      <lottery-grid
        class="content-lottery"
        ref="lottery"
        :circleTimes="5"
        @onend="onend"
        :list="list"
        @onsubmit="request"
      ></lottery-grid>
    </div>

    <div class="info" v-if="recordInfo.length">
      <span class="info-left">中奖信息</span>
      <span :class="['info-right', info && 'info-opacity1', isReplace && 'info-opacity2']">{{ info }}</span>
    </div>

    <div class="bottom">
      <div class="btn" @click="toJudgePrize">
        <img class="btn-bg" src="../../assets/imgs/common/big_btn.png" />
        <span class="btn-text">立即预约</span>
      </div>

      <div class="record" @click="toRecord">
        <img class="record-bg" src="../../assets/imgs/lottery/btn_bg.png" />
        <span class="record-text">中奖记录></span>
      </div>
    </div>

    <van-popup
      class="popup-prize"
      v-model="showPrize"
      :close-on-click-overlay="false"
    >
      <div class="popup">
        <img class="popup-bg" src="../../assets/popup/popup3.png" />
        <img class="popup-close" src="../../assets/imgs/common/close.png" @click="handleClose" />
        <div class="popup-content">
          <div class="popup-content-title" v-if="isLottery || recordType === 1">恭喜你</div>
          <div class="popup-content-text">{{text}}</div>
        </div>

        <div class="popup-btn" @click="handleClick" v-if="recordType !== 2">
          <img class="btn-bg" src="../../assets/imgs/common/big_btn.png" />
          <span class="btn-text">{{ isLottery || recordType === 1 ? '开心收下' : '预约打本'}}</span>
        </div>
      </div>
      
    </van-popup>

    <AmendPrize :show.sync="showInfo" :recordId="recordId"></AmendPrize>
  </div>
</template>

<script>
import NavigationBar from '../../components/navigationBar.vue'
import AmendPrize from '../../components/popup/amendPrize.vue'
import PlayIcon from '../../components/playIcon.vue'
import * as request from '../../api/service/game'
import util from '../../util/util'
import { Toast } from 'vant'

export default {
  name: 'Lottery',

  components: {
    [NavigationBar.name]: NavigationBar,
    [AmendPrize.name]: AmendPrize,
    PlayIcon
  },

  data() {
    return {
      showInfo: false,
      showPrize: false,
      isLottery: false,
      recordId: null,
      text: '',
      list: [
        {
          image: require('../../assets/imgs/lottery/btn_1.png'),
          index: 0,
          text: '灵动迷你筋膜枪',
          id: 4
        },
        {
          image: require('../../assets/imgs/lottery/btn_2.png'),
          index: 1,
          text: '很遗憾，没有中奖',
          id: 6
        },
        {
          image: require('../../assets/imgs/lottery/btn_3.png'),
          index: 2,
          text: '5升大容量多功能空气炸锅',
          id: 5
        },
        {
          image: require('../../assets/imgs/lottery/btn_4.png'),
          index: 3,
          text: '乐扣乐扣时尚商务保温杯',
          id: 3
        },
        {
          image: require('../../assets/imgs/lottery/btn_2.png'),
          index: 4,
          text: '很遗憾，没有中奖',
          id: 6
        },
        {
          image: require('../../assets/imgs/lottery/btn_6.png'),
          index: 5,
          text: '绞肉机',
          id: 1
        },
        {
          image: require('../../assets/imgs/lottery/btn_2.png'),
          index: 6,
          text: '很遗憾，没有中奖',
          id: 6
        },
        {
          image: require('../../assets/imgs/lottery/btn_7.png'),
          index: 7,
          text: '望海山有机小米3kg',
          id: 2
        }
      ],
      isReplace: false,
      recordInfo: [],
      info: '',
      recordType: 0, // 0 - 初始值 1 - 中奖 2- 未中奖
      timer1: null,
      timer2: null
    }
  },

  mounted() {
    this.findLotteryRecord()
  },

  destroyed() {
    clearTimeout(this.timer1)
    clearTimeout(this.timer2)
  },
 
  methods: {
    goBack() {
      // this.$router.push('/center')
      // 返回到模式页
      this.$router.go(-5)
    },

    toJudgePrize() {
      this.$router.push({
        path: '/judgePrize'
      })
    },

    handleClick() {
      this.showPrize = false
      if (this.isLottery || this.recordType === 1) {
        this.showInfo = true
      } else {
        this.$router.push({
          path: '/judgePrize'
        })
      }
    },

    rndNum(min, max) {
      if (min > max) min = [max, (max = min)][0];
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    request() {
      if (this.recordId) {
        Toast({
          message: '您已参与抽奖，继续打本获得更多抽奖机会吧！',
          position: 'top',
          className: 'toast-class',
        })
        return
      }

      //模拟抽奖请求
      this.startLottery()
    },

    startLottery() {
      const params = {
        roomId: this.$route.query.roomId,
        memberId: this.$store.getters['getUserId'],
        memberName: this.$store.getters['getNickname']
      }
      const list = [1, 4, 6]
      request.startLottery(params).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          this.$refs['lottery'].go(util.getRandomArray(list, 1)[0])
          return
        }
        
        this.recordId = res.data.result.recordId
        if (res.data.result.prizeId == 6) {
          this.isLottery = false
          this.$refs['lottery'].go(util.getRandomArray(list, 1)[0])
        } else {
          this.isLottery = true
          const index = this.list.filter(item => item.id == res.data.result.prizeId)[0].index
          this.$refs['lottery'].go(index)
        }
      }).catch(() => {
        console.log('网络异常，请稍后重试')
        this.$refs['lottery'].go(util.getRandomArray(list, 1)[0])
      }) 
    },

    //抽奖动画结束
    onend(data) {
      this.showPrize = true
      if (this.isLottery) {
        this.text = '获得' + data.text + '奖品一份'
      } else {
        this.text = data.text
      }
    },

    findLotteryRecord() {
      request.findLotteryRecord().then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }
        
        this.recordInfo = res.data.result
        if(this.recordInfo.length) this.setInfo(0)
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })
    },

    setInfo(index) {
      this.info = '恭喜' + this.recordInfo[index].memberName + '用户获得' + this.recordInfo[index].prizeName
      this.timer1 = setTimeout(() => {
        this.isReplace = true
      }, 3000)
      this.timer2 = setTimeout(() => {
        this.isReplace = false
        if (index === this.recordInfo.length - 1) {
          this.setInfo(0)
        } else {
          this.setInfo(index + 1)
        }
      }, 4000)
    },

    toRecord() {
      this.showPrize = true
      this.text = '暂无获奖记录'
      this.recordType = 2
      this.recordInfo.forEach(item => {
        console.log('-=-=-=-=-=123', item.memberId, this.$store.getters['getUserId'])
        if (item.memberId == this.$store.getters['getUserId']) {
          this.text = '获得' + item.prizeName + '奖品一份'
          this.recordType = 1
        }
      })
    },

    handleClose() {
      this.showPrize = false
      setTimeout(() => {
        this.recordType = 0
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.lottery-page {
  position: relative;
  width: 750px;
  padding-top: 100px;
  min-height: 100%;
  // overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
  }

  .title {
    position: relative;
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

  .text1 {
    position: absolute;
    top: 217px;
    left: 150px;
    width: 450px;
  }

  .text2 {
    position: absolute;
    top: 300px;
    left: 233px;
    width: 293px;
    z-index: 2;
  }

  .content {
    position: relative;
    width: 750px;
    height: 755px;
    margin-top: 100px;
    padding: 80px 79px 80px 76px;

    .content-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 750px;
    }

    .content-lottery {
      width: 595px;
      height: 595px;

      .lattice__lottery__box {
        width: 595px;
        height: 595px;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;

        .lottery__row {
          width: 595px;
          display: flex;
          justify-content: space-between;

          .prize__item {
            position: relative;
            width: 189px;
            height: 189px;
            margin: 0;
            background: url("../../assets/imgs/lottery/item_bg.png") no-repeat;
            background-size:100% 100%;
            border: none;

            .prize__item__mask {
              position: absolute;
              width: 189px;
              height: 189px;
              background: url("../../assets/imgs/lottery/choose_bg.png") no-repeat;
              background-size: 215px 215px;
              background-position: -13px -13px;
            }

            .prize__item__image {
              position: relative;
              width: 188px;
              height: 188px;
              z-index: 2;
            }

            span {
              position: relative;
              z-index: 3;
              font-size: 13px;
              line-height: 30px;
              color: #fff
            }
          }

          .lottery__button {
            position: relative;
            z-index: 2;
            width: 189px;
            height: 189px;
            margin: 0;
            background: url("../../assets/imgs/lottery/btn.png") no-repeat;
            background-size: 189px 189px;
            border: none;

            span {
              display: none;
            }
          }
        }
      }
    }
  }

  .info {
    position: relative;
    width: 700px;
    height: 35px;
    margin-top: 80px;
    border: 1px solid #00FFFF;
    border-radius: 17px;
    display: flex;
    align-items: center;

    .info-left {
      width: 127px;
      height: 33px;
      border-radius: 17px;
      background: #29E8FF;
      font-size: 23px;
      line-height: 33px;
      text-align: center;
      color: #050F27;
    }

    .info-right {
      flex: 1;
      padding: 0 14px;
      font-size: 23px;
      line-height: 33px;
      text-align: center;
      color: #fff;
      opacity: 0;
      transition: all 1s;
      word-break:keep-all;/* 不换行 */
      white-space:nowrap;/* 不换行 */
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .info-opacity1 {
      opacity: 1;
    }

    .info-opacity2 {
      opacity: 0;
    }
  }

  .bottom {
    position: relative;
    margin: 120px 0;
    width: 100%;
    display: flex;
    justify-content: center;

    .btn {
      position: relative;
      width: 300px;
      height: 73px;

      .btn-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 300px;
      }

      .btn-text {
        position: relative;
        display: block;
        font-size: 31px;
        line-height: 73px;
        text-align: center;
        color: #fff;
      }
    }
    .record {
      position: absolute;
      top: 15px;
      right: 0;
      width: 157px;
      height: 51px;

      .record-bg {
        position: absolute;
        top: 0;
        left: 0;
        height: 51px;
      }

      .record-text {
        position: relative;
        display: block;
        font-size: 23px;
        line-height: 51px;
        text-align: center;
        color: #fff;
      }
    }
  }

  .popup-prize {
    width: 750px;
    height: 100vh;
    background: rgba(5,14,34,0.68);
    display: flex;
    justify-content: center;
    align-items: center;

    .popup {
      position: relative;
      width: 579px;
      height: 718px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .popup-bg {
        position: absolute;
        top: 30px;
        left: 0;
        width: 579px;
      }

      .popup-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 45px;
        z-index: 9;
      }

      .popup-content {
        position: relative;
        width: 579px;
        height: 520px;
        padding: 180px 100px 40px 100px;

        .popup-content-title {
          font-size: 67px;
          line-height: 82px;
          text-align: center;
          font-weight: 600;
          color: #66FFFF;
        }

        .popup-content-text {
          height: 200px;
          padding-top: 40px;
          font-size: 33px;
          line-height: 40px;
          text-align: center;
          font-weight: 600;
          color: #FEFFFF;
        }
      }

      .popup-btn {
        position: relative;
        width: 317px;
        height: 90px;

        .btn-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 317px;
        }

        .btn-text {
          position: relative;
          display: block;
          font-size: 36px;
          line-height: 80px;
          text-align: center;
          color: #fff;
        }
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
</style>
