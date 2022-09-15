<template>
  <div class="popup-wapper" v-if="show">
    <van-popup
        class="popup"
        v-model="show"
        :close-on-click-overlay="false"
        v-if="type === 1"
    >
      <div class="popup-content">
        <div class="popup-content-close" @click="handleClose"></div>
        <div class="popup-content-text">
          {{text}}
        </div>
      </div>
    </van-popup>
    <van-popup
        :overlay="false"
        class="ruler"
        v-model="show"
        :close-on-click-overlay="false"
        v-if="type === 2 || type === 3"
    >
      <div class="ruler-content" @click.stop.prevent="handleClose" >
        <div class="ruler-content-close" @click="handleClose"></div>
        <div class="ruler-content-text">
          <div class="ruler-content-text1">
            终极密卷H5活动规则
          </div>
          <div class="ruler-content-text2" v-if="type === 2 || type === 3">
            【活动简介】<br>
            为感谢广大用户对三翼鸟的支持，现开展《智慧生活启示录》沉浸式剧本游戏活动；邀您参与活动到店打本，实景搜证，沉浸式体验智慧家生活，赢取精美家装好礼。<br>
            【活动时间】<br>
            2022年9月13日至2022年9月30日<br>
            【活动规则】<br>
            游戏设为「打本模式」和「游客模式」。 <br>
            1.「打本模式」说明：<br>
            用户选择打本模式，输入相应房间号后，根据个人角色，选择AI阵营或反AI阵营，点击确定即可开始答题挑战。<br>
            a)「打本模式」仅供参与三翼鸟线下门店实景剧本游戏的用户现场打本体验。<br>
            b)「打本模式」每轮共有6位用户同时参与，每位用户只有一次参与机会。<br>
            c)「打本模式」每轮游戏共设置6道题，每题拥有15秒答题时间。<br>
            d)「打本模式」每题第一位回答正确的用户，个人加1积分，其所属阵营加1积分；最后一题答对，个人及其所属阵营均可加2积分。<br>
            e)「打本模式」用户答完6题后可根据6题累计的积分，至本场次《智慧生活启示录》沉浸式剧本游戏DM处兑换相应的金币。<br>
            <br>
            2.「游客模式」说明：<br>
            a)「游客模式」仅供线上用户参与体验。游客回答6道题后可免费获得三翼鸟智慧家好礼，并可在线预约三翼鸟线下门店《智慧生活启示录》沉浸式剧本游戏体验。<br>
            b)「游客模式」游客可在线匹配其他游客PK或人机PK，每轮游戏需完成6题问答，每题拥有15秒答题时间。<br>
            c)「游客模式」每题最先回答正确加1积分，最后一题答对得双倍积分；答错或超时均计为本题0积分。<br>
            d)「游客模式」用户回答全部6道题后，即可开启转盘抽奖1次，每个ID仅有1次抽奖机会，中奖后将不可继续参与活动。<br>
            <br>
            【活动备注】<br>
            1.未注册三翼鸟APP的用户，参与及助力本活动时需先下载注册登录三翼鸟APP。<br>
            2.「打本模式」中用户获得积分后可凭借手机截图至DM处兑换道具，限用户参与活动当时兑换，过期不予受理。<br>
            3.「游客模式」中，若您获得三翼鸟实物奖品，请务必在72小时内提供有效收货地址等信息（收货地址信息一经填写确认则不可更改），若超时未提供，即视为您放弃领取奖品，商家将无法为您发货。奖品将在活动结束后30个工作日内陆续发出，如遇不可抗力因素导致发货延迟，请您理解并耐心等待。<br>
            4.同一个账号、同一个手机号、同一个支付账号以及同一个设备号均视为同一用户；如果用户以任何不正当手段或舞弊方式参与本活动，一经发现，三翼鸟有权对该用户的账号进行异常标记。对于账号异常用户的奖励发放，三翼鸟有权采取不发奖品等措施，亦有权收回用户可领取的奖励，追讨已发放的奖励，并保留追究该户责任的权利。如因此给用户造成的损失，三翼鸟不进行任何赔偿或补偿。不正当手段及舞弊行为包括但不限于：使用非法工具分享、下载、安装、注册、登录多个账号及其他不正当手段。<br>
            5.活动方可根据活动举办的实际情况，在法律允许范围内，对本活动说明进行变动或者调整。<br>
            6.本活动与Apple.lnc无关，本活动仅限18岁以上用户参与。<br>
            7.本次活动最终解释权归三翼鸟所有。<br>
          </div>
          <div class="ruler-content-iconText"></div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
name: "popup",
  data() {
    return {

    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 'todo'
    },
  },
  methods:{
    handleClose(){
      this.$emit('handleHidden')
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-wapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5,40,82,0.7);
  z-index: 9999;
}
.popup{
  width: 80%;
  height: 20%;
  background:rgba(255,255,255,0);
  padding: 20px;
  box-sizing: border-box;
  &-content{
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../../assets/popup/popup1.png") no-repeat;
    background-size:100% 100%;
    font-size: 30px;
    color: #fff;
    &-close{
      position: absolute;
      right: 12px;
      top: -20px;
      width: 46px;
      height: 46px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-text{
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.ruler{
  width: 720px;
  height: 1200px;
  background:rgba(255,255,255,0);
  overflow: hidden;
  &-content{
    position: relative;
    width: 100%;
    height: 100%;
    background: url("../../assets/popup/popup2.png") no-repeat;
    background-size:100% 100%;
    font-size: 30px;
    color: #fff;
    &-close{
      position: absolute;
      right: 12px;
      top: 0;
      width: 60px;
      height: 60px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-icon{
      position: absolute;
      right: 12px;
      top: -20px;
      width: 46px;
      height: 46px;
      background: url("../../assets/popup/close.png") no-repeat;
      background-size:100% 100%;
    }
    &-text{
      width: 100%;
      height: 100%;
    }
    &-text1{
      padding-top: 130px;
      font-size: 44px;
      text-align: center;
      color: #86F8FF;
    }
    &-text2{
      height: 720px;
      overflow: auto;
      margin-top: 40px;
      padding: 0 80px 0 80px;
      font-size: 20px;
      color: #cde1e8;
      text-align: start;
    }
    &-iconText{
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 290px;
      height: 150px;
      background: url("../../assets/textIcon/text1.png") no-repeat;
      background-size:100% 100%;
    }
  }
}


::v-deep .van-popup{
  font-size: 11px;
  background:rgba(255,255,255,0);
}
</style>
