<template>
  <div class="prepare-page">
    <img class="bg" src="../../assets/imgs/game/bg_2.png" />
    <NavigationBar :isBack="false" @goBack="goBack" />
    <div class="title">
      <p class="title-top">《智慧生活启示录》</p>
      <p class="title-bottom">终极密卷</p>
    </div>

    <div class="time">
      <img class="time-bg" src="../../assets/imgs/game/title_bg.png" />
      <span class="time-left">拥护AI阵营</span>
      <span class="time-content">{{ time ? `00 : 0${ time }` : '' }}</span>
      <span class="time-right">反AI阵营</span>
    </div>

    <div class="content-big">
      <img class="content-bg" src="../../assets/imgs/game/content_bg.png" />
      <img class="content-vs" src="../../assets/imgs/game/vs.png" />

      <div class="content-left">
        <div class="content-item" v-for="item in prosList" :key="item.memberId">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_1.png" />
            <div v-if="!item.status" class="shadow"></div>
          </div>
          <div class="item-name">{{ item.memberName }}</div>
        </div>

        <div class="content-item" v-for="item in 3 - prosList.length" :key="item + 'left'">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_2.png" />              
          </div>
          <div class="item-name">等待中...</div>
        </div>
      </div>

      <div class="content-right">
        <div class="content-item" v-for="item in consList" :key="item.memberId">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_1.png" />
            <div v-if="!item.status" class="shadow"></div>
          </div>
          <div class="item-name">{{ item.memberName }}</div>
        </div>

        <div class="content-item" v-for="item in 3 - consList.length" :key="item + 'right'">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_2.png" />              
          </div>
          <div class="item-name">等待中...</div>
        </div>
      </div>
    </div>

    <!-- <div class="content-small">
      <img class="content-bg" src="../../assets/imgs/game/content_bg_2.png" />
      <img class="content-vs" src="../../assets/imgs/game/vs.png" />

      <div class="content-left">
        <div class="content-item" v-for="item in prosList" :key="item.memberId">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_1.png" />
            <div v-if="!item.status" class="shadow"></div>
          </div>
          <div class="item-name">{{ item.memberName }}</div>
        </div>

        <div class="content-item" v-for="item in 1 - prosList.length" :key="item + 'left'">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_2.png" />              
          </div>
          <div class="item-name">等待中...</div>
        </div>
      </div>

      <div class="content-right">
        <div class="content-item" v-for="item in consList" :key="item.memberId">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_1.png" />
            <div v-if="!item.status" class="shadow"></div>
          </div>
          <div class="item-name">{{ item.memberName }}</div>
        </div>

        <div class="content-item" v-for="item in 1 - consList.length" :key="item + 'right'">
          <div class="item-img">
            <img class="img-bg" src="../../assets/imgs/game/img_bg_2.png" />              
          </div>
          <div class="item-name">等待中...</div>
        </div>
      </div>
    </div> -->

    <div class="btn-group">
      <div class="btn" @click="prepare">
        <img class="btn-bg" src="../../assets/imgs/common/small_btn.png" />
        <span class="btn-text">准备开始</span>
      </div>

      <div class="btn" @click="quite">
        <img class="btn-bg" src="../../assets/imgs/common/small_btn.png" />
        <span class="btn-text">退出</span>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from '../../components/navigationBar.vue'
import * as request from '../../api/service/game'
import Url from '../../api/url'

export default {
  name: 'Prepare',

  components: {
    [NavigationBar.name]: NavigationBar,
  },

  data() {
    return {
      time: 0,
      interval: null,
      isPrepare: false,
      consList: [], // 反对阵营
      prosList: [], // 拥护阵营
      isInit: true, // 是否在当前页面
      lockReconnect: false,//是否真正建立连接
      sendFixHeartTimer: null
    }
  },

  mounted() {
    // 初始化websocket
    this.initWebSocket()
    this.initRoomMember()
    this.isInit = true
    // this.heartCheckFun()
  },

  destroyed() {
    // 离开页面生命周期函数
    this.reset()
  },

  methods: {
    goBack() {
      this.quite()
    },

    countdown(time) {
      this.time = time
      if (this.interval) clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.time--

        if (this.time <= 0) {
          this.websocketOnclose()
          clearInterval(this.interval)

          this.$router.push({
            path: '/answer',
            query: {
              roomId: this.$route.query.roomId,
              userId: this.$store.getters['getUserId'],
              type: this.$route.query.type
            }
          })
        }
      }, 1000)
    },
    // 获取房间人数
    initRoomMember() {
      request.initRoomMember({ roomId: this.$route.query.roomId }).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }

        const data = res.data.result
        data.forEach(item => {
          if (item.type) {
            this.consList.push(item)
          } else {
            this.prosList.push(item)
          }
        })
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })  
    },

    prepare() {
      if (this.isPrepare) return

      const params = {
        memberId: this.$store.getters['getUserId'],
        roomId: this.$route.query.roomId
      }
      request.doPrepare(params).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }
        
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })
    },

    quite() {
      if (this.isPrepare) return

      const params = {
        memberId: this.$store.getters['getUserId'],
        roomId: this.$route.query.roomId,
        type: this.$route.query.type
      }
      request.outCamp(params).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }
        this.$router.go(-1)
        this.reset()
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })
    },

    initWebSocket() {
      // console.log("开始WebSocket连接...")
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userId = this.$store.getters['getUserId']
      if (userId && !this.lockReconnect) {
        var url = `${process.env.VUE_APP_WS}` + Url.ws + `?roomId=${this.$route.query.roomId}&memberId=${userId}`
        console.log('websocket-=-=-=-=-=-=-url', url)
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
      console.log('websocket-=-=-=-=-=data', data)
      
      // 加入阵营
      if (data.flag === 'join') {
        const list1 = this.prosList.filter(item => item.memberId === data.memberId)
        const list2 = this.consList.filter(item => item.memberId === data.memberId)
        if (!data.camp) {
          if (list1.length) this.prosList = this.prosList.filter(item => item.memberId !== data.memberId)
          this.prosList.push({
            memberId: data.memberId,
            memberName: data.memberName,
            status: data.status,
            type: data.camp,
            roomId: data.roomId
          })
        } else {
          if (list2.length) this.consList = this.consList.filter(item => item.memberId !== data.memberId)
          this.consList.push({
            memberId: data.memberId,
            memberName: data.memberName,
            status: data.status,
            type: data.camp,
            roomId: data.roomId
          })
        }
      } else if (data.flag === 'out') { // 退出阵营
        this.prosList = this.prosList.filter(item => item.memberId !== data.memberId)
        this.consList = this.consList.filter(item => item.memberId !== data.memberId)
        // this.prosList.forEach((item, index) => {
        //   if (item.memberId === data.memberId) this.prosList.splice(index, 1, '')
        // })
      } else if (data.flag === 'prepare') { // 准备
        if (data.memberId == this.$store.getters['getUserId']) this.isPrepare = true
        this.prosList.forEach(item => {
          if (item.memberId === data.memberId) this.$set(item, 'status', 1)
        })
        this.consList.forEach(item => {
          if (item.memberId === data.memberId) this.$set(item, 'status', 1)
        })

        if (data.prepareNumber >= 6) {
          this.$store.dispatch('setConsList', this.consList)
          this.$store.dispatch('setProsList', this.prosList)
          this.countdown(5)
          this.reset()
        }
      }
      
      this.heartCheckFun()
      console.log('-=-=-=-=-=-321', this.prosList, this.consList)
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

<style lang="scss" scoped>
.prepare-page {
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

  .content-big {
    position: relative;
    margin: 40px 22px 0 22px;
    padding: 50px 55px 0 55px;
    height: 730px;
    display: flex;
    justify-content: space-between;

    .content-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 706px;
    }

    .content-vs {
      position: absolute;
      top: 140px;
      left: 176px;
      width: 354px;
    }

    .content-left, .content-right {
      width: 171px;
      display: flex;
      flex-direction: column;

      .content-item {
        width: 171px;
        margin-bottom: 0.06rem;
        
        .item-img {
          position: relative;
          width: 171px;
          height: 167px;

          .img-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 171px;
          }

          .shadow {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 130px;
            height: 127px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
          }
        }

        .item-name {
          padding-top: 0.1333rem;
          text-align: center;
          font-size: 24px;
          line-height: 28px;
          text-align: center;
          color: #fff;
        }
      }
    }
  }

  .content-small {
    position: relative;
    margin: 40px 22px 0 22px;
    padding: 50px 55px 0 55px;
    height: 730px;
    display: flex;
    justify-content: space-between;

    .content-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 706px;
    }

    .content-vs {
      position: absolute;
      top: 140px;
      left: 176px;
      width: 354px;
    }

    .content-left, .content-right {
      width: 171px;
      display: flex;
      flex-direction: column;

      .content-item {
        width: 171px;
        margin-bottom: 0.06rem;
        
        .item-img {
          position: relative;
          width: 171px;
          height: 167px;

          .img-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 171px;
          }

          .shadow {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 130px;
            height: 127px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
          }
        }

        .item-name {
          padding-top: 0.1333rem;
          text-align: center;
          font-size: 24px;
          line-height: 28px;
          text-align: center;
          color: #fff;
        }
      }
    }
  }

  .btn-group {
    position: relative;
    padding: 84px 113px;
    display: flex;
    justify-content: space-between;

    .btn {
      position: relative;
      width: 230px;
      height: 90px;

      .btn-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 230px;
      }

      .btn-text {
        position: relative;
        display: block;
        font-size: 31px;
        text-align: center;
        line-height: 90px;
        font-weight: 600;
        color: #fff;
      }
    }
  }
}
</style>
