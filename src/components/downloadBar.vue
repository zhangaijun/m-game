<template>
  <div class="download-bar" v-if="show">
    <van-icon name="cross" @click="close" />
    <div class="bar-img">
      <img src="https://cdn09.ehaier.com/shunguang/H5/www/img/sgmobile/sybird_logo.png" />
    </div>
    <div class="bar-info">
      <p class="info-text">打开 三翼鸟APP</p>
      <p class="info-text">定制智慧家，就找三翼鸟</p>
    </div>
    <div class="bar-btn" id="download-btn">立即打开</div>
  </div>
</template>

<script>
export default {
  name: 'DownloadBar',

  data() {
    return {
      show: false,
      ua: navigator.userAgent,
    }
  },

  methods: {
    close() {
      this.show = false
    },

    /**
     * 拉起APP
     * @param {*} Openinstall H5
     * @param {*} id  不能为空
     */
    openInstall(id, targetUrl = location.href) {
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src = '//res.cdn.openinstall.io/openinstall.js'
      s.addEventListener('load',()=>{
        let data = OpenInstall.parseUrlParams()//openinstall.js中提供的工具函数，解析url中的所有查询参数
        data = {
          ...data,
          targetUrl: targetUrl + '&browerFirstIn=0',
          type: 'launchToPage'
        }
        new OpenInstall({
          /*appKey必选参数，openinstall平台为每个应用分配的ID*/
          appKey : "f7x9re",
          /*openinstall初始化完成的回调函数，可选*/
          onready : function() {
            let m = this
            let button = document.getElementById(id)

            /*在app已安装的情况尝试拉起app*/
            m.schemeWakeup()
            /*用户点击某个按钮时(假定按钮id为downloadButton)，安装app*/
            button.onclick = function() {
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
    ua: {
      handler(newValue) {
        if (newValue.indexOf('App/SyBird') > -1) {
          this.show = false
        } else {
          this.show = true
          setTimeout(() => {
            this.openInstall("download-btn")
          }, 500) 
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.download-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);

  .van-icon  {
    font-size: 32px;
    color: #fff;
    margin: 0 20px;
  }

  .bar-img {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .bar-info {
    flex: 1;
    padding-left: 20px;
    .info-text {
      font-size: 24px;
      margin: 0;
      line-height: 28px;
      text-align: left;
      color: #fff;
    }
  }

  .bar-btn {
    width: 160px;
    background: #be965a;
    font-size: 26px;
    line-height: 80px;
    text-align: center;
  }
}
</style>
