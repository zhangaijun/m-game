import Url from '../api/url'
import store from '../store/index'

export const websocketMixin = {
  data() {
    return {
      lockReconnect: false,//是否真正建立连接
      heartCheck: null
    }
  },
  mounted() {
    // 初始化websocket
    this.initWebSocket()
    // this.heartCheckFun()
  },
  destroyed() {
    // 离开页面生命周期函数
    this.websocketOnclose()
  },
  methods: {
    initWebSocket() {
      // console.log("开始WebSocket连接...")
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userInfo = store.getters.getUserInfo
      if (userInfo && !this.lockReconnect) {
        var url = `${process.env.VUE_APP_WS}` + Url.ws + `?roomId=${this.$route.query.roomId}&memberId=${this.$route.query.userId}`
        this.websock = new WebSocket(url)
        this.websock.onopen = this.websocketOnopen
        this.websock.onerror = this.websocketOnerror
        this.websock.onmessage = this.websocketOnmessage
        this.websock.onclose = this.websocketOnclose
      }
    },
    websocketOnopen() {
      this.lockReconnect = true
      console.log('WebSocket连接成功')
    },
    websocketOnerror(e) {
      this.reconnect()
    },
    websocketOnclose(e) {
      this.lockReconnect = false
      this.reconnect()
    },
    reconnect() {
      if (this.lockReconnect) return
      this.lockReconnect = true
      //没连接上会一直重连，设置延迟避免请求过多 10s连接一次
      setTimeout(() => {
        this.initWebSocket()
        this.lockReconnect = false
      }, 10000)
    },
    websocketOnmessage(msg) {
      this.lockReconnect = true
      const data = JSON.parse(msg.data)
      console.log('-=-=-=-=-=', data)
      
      // 加入阵营
      if (data.flag === 'join') {
        if (!data.camp) {
          this.prosList.push({
            memberId: data.memberId,
            memberName: data.memberName,
            status: data.status,
            type: data.camp,
            roomId: data.roomId
          })
        } else {
          this.consList.push({
            memberId: data.memberId,
            memberName: data.memberName,
            status: data.status,
            type: data.camp,
            roomId: data.roomId
          })
        }
      } else if (data.flag === 'out') {
        if (!data.camp) {
          // this.prosList.forEach((item, index) => {
          //   if (item.memberId === data.memberId) this.prosList.splice(index, 1, '')
          // })
          this.prosList = this.prosList.filter(item => item.memberId !== data.memberId)
        } else {
          // this.consList.forEach((item, index) => {
          //   if (item.memberId === data.memberId) this.consList.splice(index, 1, '')
          // })
          this.consList = this.consList.filter(item => item.memberId !== data.memberId)
        }
      } else if (data.flag === 'prepare') {
        if (!data.camp) {
          this.prosList.forEach(item => {
            if (item.memberId === data.memberId) this.$set(item, 'status', 1)
          })
        } else {
          this.consList.forEach(item => {
            if (item.memberId === data.memberId) this.$set(item, 'status', 1)
          })
        }
      }
    }
  }

}