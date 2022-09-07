<template>
  <div class="result-page">
    <div @click="getLastScore">获取最终成绩</div>
  </div>
</template>

<script>
import * as request from '../../api/service/game'

export default {
  name: 'Result',

  data() {
    return {
      roomId: Number(this.$route.query.roomId),
      prosScore: 0,
      consScore: 0,
      consList: [], // 反对阵营
      prosList: [], // 拥护阵营
    }
  },

  mounted() {

  },

  methods: {
    getLastScore() {
      request.getLastScore({roomId: this.roomId}).then(res => {
        if (!res.data.success) {
          console.log(res.data.error)
          return
        }

        const data = res.data.result
        this.prosScore = data.prosScore
        this.consScore = data.consScore

        data.memberScoreList.forEach(item => {
          if (item.type) {
            this.consList.push(item)
          } else {
            this.prosList.push(item)
          }
        })
      }).catch(() => {
        console.log('网络异常，请稍后重试')
      })
    }
  }
}
</script>