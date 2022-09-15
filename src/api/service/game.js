import request from '../http'
import url from '../url'

// 准备
export const doPrepare = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.doPrepare,
    method: 'post',
    data,
  })
}

// 获取房间
export const getRoom = (data) => {
  console.log('-=-=-=-=-=', process.env, process.env.VUE_APP_BASE_URL)
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.getRoom,
    method: 'post',
    data,
  })
}

// 初始化加入房间的人员（每个加入阵营的会员第一次加载时调用）
export const initRoomMember = (data) => {
  console.log('-=-=-=-=', data)
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.initRoomMember,
    method: 'post',
    params: data
  })
}

// 加入阵营
export const joinCamp = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.joinCamp,
    method: 'post',
    data,
  })
}

// 离开阵营
export const outCamp = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.outCamp,
    method: 'post',
    data,
  })
}

// 获取试题
export const findQues = (params) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.findQues,
    method: 'get',
    params,
  })
}

// 提交答案
export const submitAnswer = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.submitAnswer,
    method: 'post',
    data,
  })
}

// 获取最近战绩
export const findRecentRecord = (params) => {
  console.log('-=-=-=-=', params)
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.findRecentRecord,
    method: 'get',
    params,
  })
}

// 获取最后得分
export const getLastScore = (params) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.getLastScore,
    method: 'get',
    params,
  })
}

// 加入房间和阵营
export const joinRoomAndCamp = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.joinRoomAndCamp,
    method: 'post',
    data,
  })
}

// 机器人加入
export const robotJoin = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.robotJoin,
    method: 'post',
    data,
  })
}

// 保存奖品领取信息
export const claim = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.claim,
    method: 'post',
    data,
  })
}

// 抽奖
export const startLottery = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.startLottery,
    method: 'post',
    data,
  })
}

// 查询城市
export const findCity = (params) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.findCity,
    method: 'get',
    params,
  })
}

// 获取店铺
export const findShop = (params) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.findShop,
    method: 'get',
    params,
  })
}

// 保存预约信息
export const saveSubscribe = (data) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.saveSubscribe,
    method: 'post',
    data,
  })
}

// 获取店铺
export const findLotteryRecord = (params) => {
  return request({
    url: process.env.VUE_APP_BASE_URL+ url.findLotteryRecord,
    method: 'get',
    params,
  })
}
