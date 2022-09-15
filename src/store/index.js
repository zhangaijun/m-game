import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state() {
    return {
      token: '',
      userInfo: {}, // 登录用户信息
      userId: '1020030716', // 用户id
      nickname: '17863931610', // 用户昵称
      avatar: '', // 用户头像
      consList: [], // 反对阵营
      prosList: [], // 拥护阵营
      isPlay: false, // 背景音乐是否播放
      isRecover: false, // 背景音乐是否恢复播放
    }
  },
  mutations: {
    SET_TOKEN(state, val) {
      state.token = val
    },

    SET_USER_INFO(state, val) {
      state.userInfo = val
    },

    SET_USER_ID(state, val) {
      state.userId = val
    },

    SET_NICKNAME(state, val) {
      state.nickname = val
    },

    SET_AVATAR(state, val) {
      state.avatar = val
    },

    SET_CONSLIST(state, val) {
      state.consList = val
    },

    SET_PROSLIST(state, val) {
      state.prosList = val
    },

    SET_ISPLAY(state, val) {
      state.isPlay = val
    },

    SET_ISRECOVER(state, val) {
      state.isRecover = val
    },
  },
  actions: {
    setToken(content, data) {
      content.commit('SET_TOKEN', data)
    },

    setUserInfo(content, data) {
      content.commit('SET_USER_INFO', data)
    },

    setUserId(content, data) {
      content.commit('SET_USER_ID', data)
    },

    setNickname(content, data) {
      content.commit('SET_NICKNAME', data)
    },

    setAvatar(content, data) {
      content.commit('SET_AVATAR', data)
    },

    setConsList(content, data) {
      content.commit('SET_CONSLIST', data)
    },

    setProsList(content, data) {
      content.commit('SET_PROSLIST', data)
    },

    setIsPlay(content, data) {
      content.commit('SET_ISPLAY', data)
    },

    setIsRecover(content, data) {
      content.commit('SET_ISRECOVER', data)
    }
  },
  getters: {
    getToken(state) {
      return state.token
    },

    getUserInfo(state) {
      return state.userInfo
    },

    getUserId(state) {
      return state.userId
    },

    getNickname(state) {
      return state.nickname
    },

    getAvatar(state) {
      return state.avatar
    },

    getConsList(state) {
      return state.consList
    },

    getProsList(state) {
      return state.prosList
    },

    getIsPlay(state) {
      return state.isPlay
    },

    getIsRecover(state) {
      return state.isRecover
    }
  },
  modules: {
    // dragStore,
  },
})
