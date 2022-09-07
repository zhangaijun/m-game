import UplusApi from '@uplus/uplus-api'

const instance = new UplusApi()
instance.initDeviceReady()

export default {
  // 判断用户是否登录
  async getLoginStatus() {
    await instance.initDeviceReady()
    const result = await instance.upUserModule.getLoginStatus()
    if (result.retCode === '000000') {
      return result.retData.isLogin
    }
  },

  goToPage(url) {
    instance.initDeviceReady().then(() => {
      instance.upVdnModule.goToPage({ url: url })
    }).catch(e => { console.log(e) })
  },
  
  // 获取用户信息并存储到store
  getUserInfo() {
    instance.initDeviceReady().then(() => {
      instance.upUserModule.getUserInfo().then((result) => {
        if (result.retCode === '000000') {
          this.$store.dispatch('setToken', result.retData.user_center_access_token)
          this.$store.dispatch('setUserInfo', result.retData)
          this.$store.dispatch('setUserId', result.retData.userId)
          this.$store.dispatch('setNickname', result.retData.phoneNumber)
          this.$store.dispatch('setAvatar', result.retData.avatar)
          window.alert(result.retData.phoneNumber)
        }
      }).catch(e => { console.log(e) })
    }).catch(e => { console.log(e) })
  },

  // 跳转到app页面
  openNewWindow(url, flag, skip = false, showheader = true) {
    let targetUrl = this.getOpenNewWindowUrl(url, flag, skip, showheader)
    instance.initDeviceReady().then(() => {
      instance.upVdnModule.goToPage({ url: encodeURI(targetUrl) })
    }).catch(e => { console.log(e) })
  },
    /**
   *
   * @param {*} url 跳转地址
   * @param {*} flag 表示是否为完整url
   * @param {*} skip 表示是否跳过 拼接 container_type=3&show_title_bar=true&hidesBottomBarWhenPushed=1
   * @param {*} showheader 是否带原生头
   * @param {*} replace 是否替换url
   *
   */
  getOpenNewWindowUrl(url, flag, skip, showheader){
    let targetUrl = flag ? url : _config.HOST + url
    if (!skip) {
      if (targetUrl.indexOf('#') !== -1) {
        let arr = targetUrl.split('#')
        let startStr = arr[0];
        let endStr = arr[1];
        if (arr[0].indexOf('?') !== -1) {
          startStr += `&container_type=3&show_title_bar=${showheader}&hidesBottomBarWhenPushed=1`
        } else {
          startStr += `?container_type=3&show_title_bar=${showheader}&hidesBottomBarWhenPushed=1`
        }
        targetUrl = startStr + '#' + endStr
      } else {
        if (targetUrl.indexOf('?') !== -1) {
          targetUrl += `&container_type=3&show_title_bar=${showheader}&hidesBottomBarWhenPushed=1`
        } else {
          targetUrl += `?container_type=3&show_title_bar=${showheader}&hidesBottomBarWhenPushed=1`
        }
      }
    }
    return targetUrl
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
}