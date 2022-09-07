<template>
  <div class="start-page">
    <van-field
      v-model="roomNo"
      placeholder="请输入房间号"
      :border="false"
      bind:change="onChange"
    />
    <div @click="getRoom">确定</div>

    <div class="camp">
      <div class="camp-item" @click="joinCamp(0)">拥护AI阵营</div>
      <div class="camp-item" @click="joinCamp(1)">反AI阵营</div>
    </div>
    <!-- <div @click="findRecentRecord">获取最新战绩</div> -->
    <!-- <div @click="joinCamp">加入阵营</div> -->
    <!-- <div @click="goTo">跳转</div> -->
    
  </div>
</template>

<script>
import * as request from '../../api/service/game'

export default {
  name: 'Start',

  data() {
    return {
      roomNo: '',
      createNumberId: '',
      roomId: null,
      type: '',
    }
  },

  methods: {
    findRecentRecord() {
      request.findRecentRecord({memberId: this.$store.getters['getUserId']}).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })
    },

    getRoom() {
      const params = {
        memberId: this.$store.getters['getUserId'],
        memberName: this.$store.getters['getNickname'],
        mode: 0,
        roomNo: this.roomNo
      }
      request.getRoom(params).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }

        const data = res.data.result
        if (data.consNumber + data.prosNumber >= data.limitNumber) {
          console.log('当前房间号人数已满，请输入其他房间号')
          return
        }

        if ((data.consNumber >= data.consLimit && this.$route.query.type === '1') || (data.prosNumber >= data.prosLimit && this.$route.query.type === '0')) {
          console.log('手速慢啦，该阵营人数已满')
          return
        }
        
        // 车队创建人
        this.createNumberId = data.memberId
        this.roomId = data.id
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })  
    },

    joinCamp(type) {
      this.type = type
      const params = {
        memberId: this.$store.getters['getUserId'],
        memberName: this.$store.getters['getNickname'],
        roomId: this.roomId,
        type
      }
      request.joinCamp(params).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }

        this.goTo()
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })  
    },

    goTo() {
      this.$router.push({
        path: '/prepare',
        query: {
          roomId: this.roomId,
          userId: this.$store.getters['getUserId'],
          type: this.type
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.start-page {
  .camp {
    padding-top: 100px;
    display: flex;

    .camp-item {
      flex: 1;
      font-size: 40px;
      text-align: center;
    }
  }
}
</style>
