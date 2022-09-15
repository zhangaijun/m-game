<template>
  <div class="home">
    <NavigationBar v-if="isApp" :isBack="false" @goBack="goBack" />
    <PlayIcon />
    <transition>
      <div class="home-first" v-if="pageState" @click="pageState = 0">
        <div class="home-first-text" :style="{'top':top}">
          这是一个AI觉醒与人类共存的年代 <br>
          四维智慧世界的AI<br>
          拥有着尖端科技和智能的生活方式<br>
          每年AI空间会派遣使者前往人类世界邀约<br>
          只有被选中的顶尖人类<br>
          才能通过游戏争夺进入AI空间<br>
          <br>
          享受着高科技的智慧生活<br>
          于是人类世界与AI世界已各自为营<br>
          竞争角逐已激烈进行了大半<br>
          拥护AI阵营与反AI阵营<br>
          进入了白热化的斗争阶段<br>
          终极角逐，在此一战<br>
          最终的胜利将在这里展开<br>
          ……
        </div>
      </div>
    </transition>
    <transition name="private">
        <div class="home-second" v-if="!pageState && popupType !== 2">
          <div class="home-second-textIcon2"></div>
          <div class="home-second-textIcon3"></div>
          <div class="home-second-textIcon"></div>
          <div class="home-second-ruler">
            <van-checkbox checked-color="none" v-model="checked" shape="square" style="margin: 0 8px" icon-size="13px"></van-checkbox>
            <span>已同意</span>
            <span style="text-decoration:underline" @click="handleRuler">活动规则</span>
          </div>
          <div class="home-second-button" id="download-btn" @click="handOpen">开启终极之战</div>
        </div>
    </transition>
    <popup :show="showToast" @handleHidden="handleHidden" :text="popupText" :type="popupType"></popup>
  </div>
</template>

<script>
import util from '../util/util'
import popup from "../components/popup/popup"
import NavigationBar from '../components/navigationBar.vue'
import PlayIcon from '../components/playIcon.vue'
import UplusApi from '@uplus/uplus-api'

const instance = new UplusApi()
instance.initDeviceReady()

export default {
  name: 'Home',
  data(){
    return{
      pageState:1,
      checked:false,
      top:'90%',
      showToast:false,
      popupType:1,
      popupText:'',
      isRedy: false
    }
  },
  components:{popup, NavigationBar, PlayIcon},
  mounted() {
    this.init()
  },
  computed: {
    isApp() {
      return navigator.userAgent.indexOf('App/SyBird') > -1
    }
  },
  methods:{
    goBack() {
      util.goToPage('https://sybird.haier.com/sybirdapp/home/index.html')
    },  
    init(){
      let textRun = setInterval(()=>{
        this.top = this.top.slice(0, this.top.length - 1) - 0.1 + '%'
      },10)
      setTimeout(()=>{
        this.pageState = 0
        clearInterval(textRun)
      },18000);
    },
    async handOpen(){
      if (!this.checked){
        this.popupText = '请先阅读游戏规则并同意'
        this.popupType = 1
        this.showToast = true
        return
      }

      if (this.isApp) {
        const data = await util.getLoginStatus()

        if (!data) {
          util.goToPage('mpaas://usercenter')
        } else {
          instance.initDeviceReady().then(() => {
            instance.upUserModule.getUserInfo().then((result) => {
              if (result.retCode === '000000') {
                if (!result.retData.userId) {
                  util.goToPage('mpaas://usercenter')
                  return
                }
                this.$store.dispatch('setToken', result.retData.user_center_access_token)
                this.$store.dispatch('setUserInfo', result.retData)
                this.$store.dispatch('setUserId', result.retData.userId)
                this.$store.dispatch('setNickname', result.retData.phoneNumber)
                this.$store.dispatch('setAvatar', result.retData.avatar)
                this.$router.push('/center')
              }
            }).catch(e => { console.log(e) })
          }).catch(e => { console.log(e) })
        }
      }
      // this.$router.push('/center')
    },
    handleRuler(){
      this.popupType = 2
      this.showToast = true
    },
    handleHidden(){
      this.showToast = false
      setTimeout(()=>{
        this.popupType = 1
      },200)
    },
    /**
     * 拉起APP
     * @param {*} Openinstall H5
     * @param {*} id  不能为空
     */
   openInstall(id) {
    this.isRedy = true
    let that = this
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = '//res.cdn.openinstall.io/openinstall.js'
    s.addEventListener('load',()=>{
      let data = OpenInstall.parseUrlParams()//openinstall.js中提供的工具函数，解析url中的所有查询参数
      data = {
        ...data,
        targetUrl: process.NODE_ENV !== 'production' ? 'https://yx.rrskjfw.com.cn/' : 'https://syn.rrskjfw.com.cn/',
        type: 'launchToPage'
      }
      console.log('-=-=-=-=-=', data.targetUrl)
      new OpenInstall({
        /*appKey必选参数，openinstall平台为每个应用分配的ID*/
        appKey: "f7x9re",
        /*openinstall初始化完成的回调函数，可选*/
        onready: function() {
          let m = this
          let button = document.getElementById(id)
          
          /*在app已安装的情况尝试拉起app*/
          m.schemeWakeup()
          /*用户点击某个按钮时(假定按钮id为downloadButton)，安装app*/
          button.onclick = function() {
            if(!that.checked) return false
            m.wakeupOrInstall()
            return false
          }
        }
      }, data)
    },false)
    document.head.appendChild(s)
  },
  },
  watch: {
    pageState: {
      handler(newValue) {
        if (!newValue && !this.isApp && !this.isRedy) {
          setTimeout(() => {
            this.openInstall('download-btn')
          }, 500)
        }
      },
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  background: url("https://rrskj.oss-cn-qingdao.aliyuncs.com/syn/page1.jpg") no-repeat;
  background-size:100% 100%;

  &-first {
    position: relative;
    top: 20%;
    width: 100%;
    height: 60%;
    overflow: hidden;
    &-text {
      line-height: 50px;
      width: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 30px;
      color: #d7dfea;
      text-align: center;
      text-shadow: #5B86A9 0.4px 0 0, #5B86A9 0 0.4px 0, #5B86A9 -1px 0 0, #5B86A9 0 -1px 0;
    }
  }
  &-second {
    position: relative;
    padding-top: 70%;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: url("../assets/pageGround/page2.png") no-repeat;
    background-size:100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    &-textIcon{
      position: absolute;
      width: 270px;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      height: 152px;
      background: url("../assets/textIcon/text1.png") no-repeat;
      background-size:100% 100%;
    }
    &-textIcon2{
      position: absolute;
      top: 32%;
      left: 50%;
      transform: translateX(-50%);
      width: 560px;
      height: 102px;
      background: url("../assets/textIcon/text2.png") no-repeat;
      background-size:100% 100%;
    }
    &-textIcon3{
      position: absolute;
      top: 34%;
      left: 50%;
      transform: translateX(-50%);
      width: 560px;
      height: 260px;
      background: url("../assets/textIcon/text3.png") no-repeat;
      background-size:100% 100%;
    }
    &-ruler{
      position: absolute;
      top: 69%;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #5BE6FF;
      font-size: 16px;
    }
    &-button{
      position: absolute;
      top: 72%;
      left: 50%;
      transform: translateX(-50%);
      width: 329px;
      height: 90px;
      font-size: 32px;
      text-align: center;
      background: url("../assets/button/button1.png") no-repeat;
      background-size:100% 100%;
      color: #e8f0f1;
      line-height: 90px;
      text-shadow: #ff8fdb 0.4px 0 0, #ff8fdb 0 0.4px 0, #ff8fdb -1px 0 0, #ff8fdb 0 -1px 0;
    }
  }
}

.private-ente{
  opacity: 0.3;
}
.private-enter-active{
  transition: all 2s ease;
}

::v-deep .van-checkbox__icon .van-icon{
  // line-height: 40px;
  // width: 20px;
  // height: 20px;
  background-color: rgba(100,100,100,0);
}
</style>
