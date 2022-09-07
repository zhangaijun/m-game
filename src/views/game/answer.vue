<template>
  <div class="answer-page">
    <img class="bg" src="../../assets/imgs/game/bg_2.png" />
    <NavigationBar />
    <div class="title">
      <p class="title-top">《智慧生活启示录》</p>
      <p class="title-bottom">终极密卷</p>
    </div>
    
    <template v-if="!countdownShow">
      <div class="time">
        <img class="time-bg" src="../../assets/imgs/game/title_bg.png" />
        <span class="time-left">拥护AI阵营</span>
        <span class="time-content">00 : {{ time > 9 ? time : `0${ time }` }}</span>
        <span class="time-right">反AI阵营</span>
      </div>

      <div class="content">
        <img class="content-bg" src="../../assets/imgs/game/answer_bg.png" />

        <div class="content-score">
          <span class="support-score">{{ prosScore }}</span>
          <img class="icon" src="../../assets/imgs/game/star.png" />
          <span class="contra-score">{{ consScore }}</span>
        </div>

        <div class="content-top">
          <div class="top-left">
            <div class="top-item left-item" v-for="item in prosList" :key="item.memberId">
              <div class="item-img">
                <img class="img-bg" src="../../assets/imgs/game/img_bg_1.png" />              
              </div>
              <div class="item-score">
                <img class="score-bg" src="../../assets/imgs/game/left_score.png" />
                <span class="score-num">{{ item.score }}</span>
              </div>
              <div class="item-name">{{ item.memberName }}</div>
            </div>
          </div>

          <div class="top-content">{{ question.quesTitle }}</div>

          <div class="top-right">
            <div class="top-item right-item" v-for="item in consList" :key="item.memberId">
              <div class="item-img">
                <img class="img-bg" src="../../assets/imgs/game/img_bg_1.png" />
              </div>
              <div class="item-score">
                <img class="score-bg" src="../../assets/imgs/game/right_score.png" />
                <span class="score-num">{{ item.score }}</span>
              </div>
              <div class="item-name">{{ item.memberName }}</div>
            </div>
          </div>
        </div>

        <div class="content-bottom">
          <div class="bottom-item" v-for="item in question.optionList" :key="item.id">
            <div class="item-btn" @click="chooseItem(item)">
              <img v-if="!choose || choose !== item.optionAnswer" class="btn-bg" src="../../assets/imgs/common/big_btn.png" />
              <img v-if="choose && choose === item.optionAnswer && choose !== question.rightAnswer" class="big-btn-bg" src="../../assets/imgs/game/error_btn.png" />
              <img v-if="choose && choose === item.optionAnswer && choose === question.rightAnswer" class="big-btn-bg" src="../../assets/imgs/game/correct_btn.png" />
              <span class="btn-text">{{ item.optionStr }}</span>
            </div>

            <img v-if="choose && choose === item.optionAnswer && choose !== question.rightAnswer" class="item-icon" src="../../assets/imgs/game/error_icon.png" />
            <img v-if="choose && choose === item.optionAnswer && choose === question.rightAnswer" class="item-icon" src="../../assets/imgs/game/correct_icon.png" />
          </div>
        </div>
      </div>
    </template>

    <Dialog :show="countdownShow">
      <p class="top">答题即将开始！</p>
      <p class="center">{{ time }}</p>
      <p class="bottom">请注意：只有第一位回答正确的角色，积分+1，所属阵营积分+1</p>
    </Dialog>

    <Dialog :show="infoShow">
      <p class="info-text">本轮答题奖励</p>
      <p class="info-main">得分X2</p>
      <p class="info-text">不要错过哦~</p>

      <div class="info-btn" @click="confirm">
        <img class="btn-bg" src="../../assets/imgs/common/big_btn.png" />
        <span class="btn-text">确定</span>
      </div>
    </Dialog>

    <Dialog :show="msgShow">
      <p class="info-text">{{msg}}</p>
    </Dialog>
  </div>
</template>

<script>
import NavigationBar from '../../components/navigationBar.vue'
import Dialog from '../../components/dialog.vue'
import * as request from '../../api/service/game'
import Url from '../../api/url'

export default {
  name: 'Answer',

  components: {
    [NavigationBar.name]: NavigationBar,
    [Dialog.name]: Dialog
  },

  data() {
    return {
      time: 0,
      interval: null,
      timer: null,
      consList: this.$store.getters.getConsList, // 反对阵营
      prosList: this.$store.getters.getProsList, // 拥护阵营
      questionList: [],
      questionIndex: 0, // 题目序号
      question: {},
      choose: '',

      isInit: true, // 是否在当前页面
      lockReconnect: false,//是否真正建立连接
      sendFixHeartTimer: null,
      prosScore: 0, // 正方显示总分
      consScore: 0, // 反方显示总分
      prosTotalScore: 0, // 正方总分
      consTotalScore: 0, // 反方总分

      countdownShow: false,
      infoShow: false,
      msgShow: false,
      msg: '',
      correctId: '',
    }
  },

  mounted() {
    this.isInit = true
    // 初始化阵营分数
    this.consList.forEach(item => {
      this.$set(item, 'score', 0)
    })
    this.prosList.forEach(item => {
      this.$set(item, 'score', 0)
    })
    // 初始化websocket
    this.initWebSocket()
    this.findQues()
    this.countdown(5, true)
  },

  destroyed() {
    console.log('-=-=-=-=-=离开')
    this.reset()
  },  

  methods: {
    countdown(time, flag) {
      this.time = time
      if (flag) this.countdownShow = true
      if (this.interval) clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.time--

        if (this.time <= 0) {
          clearInterval(this.interval)
          if (flag) {
            this.countdownShow = false
            this.countdown(30)
          } else {
            if (!this.choose) this.msg = '您的手速慢了，再接再厉'
            this.toNext()
          }
        }
      }, 1000)
    },

    findQues() {
      request.findQues({ roomId: this.$route.query.roomId }).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }

        this.questionList = res.data.result
        this.question = this.questionList[this.questionIndex]
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })  
    },

    chooseItem(item) {
      if (this.choose) return
      this.choose = item.optionAnswer
      if (this.choose !== this.question.rightAnswer) {
        this.msg = '很抱歉，您答错了，再接再厉'
      }

      if (this.choose === this.question.rightAnswer && this.correctId) {
        this.msg = '您的手速慢了，再接再厉'
      }

      const params = {
        answer: this.choose,
        camp: Number(this.$route.query.type),
        doubleScore: 0, // 是否双倍积分 0-否 1-是
        memberId: this.$store.getters['getUserId'],
        memberName: this.$store.getters.getNickname,
        quesId: this.question.id,
        roomId: Number(this.$route.query.roomId)
      }
      request.submitAnswer(params).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })  
    },

    toNext() {
      this.choose = ''
      this.questionIndex++
      this.question = this.questionList[this.questionIndex]

      if (!this.question) {
        this.goTo()
        return
      }

      this.prosScore = this.prosTotalScore
      this.consScore = this.consTotalScore

      this.msgShow = true
      setTimeout(() => {
        this.msgShow = false
        if (this.question.doubleScore) {
          this.infoShow = true
        } else {
          clearInterval(this.interval)
          this.$nextTick(() => {
            this.countdown(30)
          })
        }
      }, 2000)

      this.timer = setTimeout(() => {
        this.infoShow = false
        clearInterval(this.interval)
        this.$nextTick(() => {
          this.countdown(30)
        })
      }, 4000)
    },

    confirm() {
      clearTimeout(this.timer)
      clearInterval(this.interval)
      this.$nextTick(() => {
        this.countdown(30)
      })
    },

    goTo() {
      this.websocketOnclose()
      clearInterval(this.interval)

      this.$router.push({
        path: '/result',
        query: {
          roomId: this.$route.query.roomId,
        }
      })
      this.reset()
    },

    initWebSocket() {
      // console.log("开始WebSocket连接...")
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userId = this.$store.getters['getUserId']
      if (userId && !this.lockReconnect) {
        var url = `${process.env.VUE_APP_WS}` + Url.ws + `?roomId=${this.$route.query.roomId}&memberId=${userId}`
        console.log('websocket-=-=-=-=-=-=-url2', url)
        this.websock = new WebSocket(url)
        this.websock.onopen = this.websocketOnopen
        this.websock.onerror = this.websocketOnerror
        this.websock.onmessage = this.websocketOnmessage
        this.websock.onclose = this.websocketOnclose
      }
    },
    websocketOnopen() {
      this.lockReconnect = true
      //心跳检测重置
      this.heartCheckFun()
      console.log('WebSocket连接成功')
    },
    websocketOnerror() {
      console.log('websocket-=-=-===error')
      this.lockReconnect = false
      this.reconnect()
    },
    websocketOnclose() {
      console.log('websocket-=-=-===close')
      this.lockReconnect = false
      this.reconnect()
    },
    websocketSend(text) {
      // 数据发送
      try {
        this.websock.send(text)
      } catch (err) {
        console.log('send failed (' + err.code + ')')
      }
    },
    reconnect() {
      if (this.lockReconnect || !this.isInit) return
      this.lockReconnect = true
      //没连接上会一直重连，设置延迟避免请求过多 10s连接一次
      setTimeout(() => {
        this.lockReconnect = false
        this.initWebSocket()
      }, 10000)
    },
    websocketOnmessage(msg) {
      this.lockReconnect = true
      const data = JSON.parse(msg.data)
      // 阵营总分
      this.prosTotalScore = data.prosTotalScore
      this.consTotalScore = data.consTotalScore
      // 得分人的id
      this.correctId = data.rightAnswerMemberId
      console.log('websocket-=-=-=-=-=data2', data)
      
      // 更新个人分数
      this.prosList.forEach(par => {
        data.detail.forEach(child => {
          if (par.memberId == child.memberId) par.score = child.score
        })
      })

      this.consList.forEach(par => {
        data.detail.forEach(child => {
          if (par.memberId == child.memberId) par.score = child.score
        })
      })

      // 得分的人
      if (this.correctId == this.$store.getters['getUserId']) {
        this.msg = '恭喜您最快答对，获得20积分'
      }

      // 答对但未得分的人
      if (this.correctId != this.$store.getters['getUserId'] && this.choose == this.question.rightAnswer) {
        this.msg = '您的手速慢了，再接再厉'
      }
      
      // 打本模式6个人答完或者游客模式两个人答完
      // if ((this.$route.query.mode === '0' && data.detail.length >= 6) || (this.$route.query.mode === '0' && data.detail.length >= 2)) this.toNext()
      if (data.detail.length >= 6) this.toNext()
      this.heartCheckFun()
    },

    heartCheckFun() {
      clearTimeout(this.sendFixHeartTimer)
      this.sendFixHeartTimer = setTimeout(() => {
        this.websocketSend('HeartBeat')
        console.log('websocket-=-=-=-=-=心跳')
        this.heartCheckFun()
      }, 20000)
    },

    reset() {
      this.isInit = false
      this.lockReconnect = false
      this.websock.close()
      clearInterval(this.interval)
      clearTimeout(this.sendFixHeartTimer)
    }
  }
}
</script>

<style lang="scss">
.answer-page {
  position: relative;
  width: 750px;
  padding-top: 100px;
  min-height: 100%;

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

  .time {
    position: relative;
    padding: 100px 100px 0 100px;
    display: flex;

    .time-bg {
      position: absolute;
      top: 100px;
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

  .content {
    position: relative;
    height: 1108px;
    margin: 0 0.133rem;
    padding: 0 0.133rem;

    .content-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 730px;
    }

    .content-score {
      position: relative;
      padding: 0.1633rem 240px;
      display: flex;
      justify-content: space-between;

      .support-score, .contra-score {
        display: block;
        font-size: 32px;
        line-height: 50px;
        font-weight: 600;
        color: #fff;
      }

      .icon {
        height: 50px;
      }
    }

    .content-top {
      position: relative;
      display: flex;

      .top-left {
        width: 175px;
        display: flex;
        flex-direction: column;

        .left-item {
          width: 153px;

          .item-score {
            width: 109px
          }
        }
      }

      .top-right {
        width: 135px;
        display: flex;
        flex-direction: column;

        .right-item {
          width: 134px;

          .item-score {
            width: 89px
          }
        }
      }

      .top-item {
        position: relative;
        margin-bottom: .1rem;
        height: 132px;

        .item-img {
          position: relative;
          width: 114px;
          height: 107px;

          .img-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 114px;
          }
       }

        .item-score {
          position: absolute;
          top: 0;
          right: 0;
          height: 39px;

          .score-bg {
            position: absolute;
            top: 0;
            left: 0;
            height: 39px;
          }

          .score-num {
            position: relative;
            display: block;
            padding: 0 12px;
            font-size: 23px;
            font-weight: 600;
            line-height: 39px;
            color: #fff;
          }
        }

        .item-name {
          padding-top: 0.0665rem;
          padding-left: 20px;
          font-size: 20px;
          line-height: 24px;
          color: #fff;
        }
      }

      .top-content {
        flex: 1;
        height: 420px;
        padding: 40px 40px 40px 0;
        font-size: 32px;
        line-height: 40px;
        color: #fff;
      }
    }

    .content-bottom {
      position: relative;
      padding: 20px 0 0 150px;
      display: flex;
      flex-direction: column;

      .bottom-item {
        width: 480px;
        height: 101px;
        margin-bottom: 0.1333rem;
        display: flex;
        align-items: center;

        .item-btn {
          position: relative;
          width: 397px;
          height: 101px;
          display: flex;
          align-items: center;
          justify-content: center;

          .btn-bg {
            position: absolute;
            top: 0;
            width: 397px;
          }

          .big-btn-bg {
            position: absolute;
            top: -86px;
            left: -200px;
            height: 300px;
          }

          .btn-text {
            position: relative;
            font-size: 35px;
            color: #fff;
          }
        }

        .item-icon {
          width: 80px;
          height: 80px;
        }
      }
    }
  }

  .dialog {
    .top {
      position: relative;
      margin: 0;
      font-size: 33px;
      line-height: 40px;
      text-align: center;
      font-weight: 600;
      color: #fff;
    }

    .center {
      position: relative;
      margin: 0;
      font-size: 200px;
      line-height: 248px;
      text-align: center;
      font-family: Lantinghei SC;
      font-weight: 600;
      color: rgba(102,255,255,0.8);
    }

    .bottom {
      position: relative;
      margin: 0;
      font-size: 27px;
      line-height: 40px;
      text-align: center;
      font-weight: 600;
      color: #fff;
    }

    .info-text {
      position: relative;
      margin: 0;
      font-size: 33px;
      line-height: 40px;
      text-align: center;
      font-weight: 600;
      color: #fff;
    }

    .info-main {
      position: relative;
      margin: 0;
      padding: 16px 0 18px 0;
      font-size: 67px;
      line-height: 82px;
      text-align: center;
      font-family: Lantinghei SC;
      font-weight: 600;
      color: rgba(102,255,255,0.8);
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
