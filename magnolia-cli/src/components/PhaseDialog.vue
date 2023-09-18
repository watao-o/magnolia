<template>
  <v-dialog
    v-model="showFlg"
    width="auto"
    :light="true"
    persistent
  >
  <v-card>
    <v-card-text>
      <pre><span class="custom-text">{{ dialogMsg }}</span></pre>
    </v-card-text>
  </v-card>
</v-dialog>

</template>

<script>
export default {
  name: 'phaseDialog',
  props: {
    nextPhase: { type: Function, required: true }
  },
  data () {
    return {
      showFlg: false,
      dialogMsg: 'ターン終了します'
    }
  },
  methods: {
    openDialog(msg) {
      this.dialogMsg = msg
      this.showFlg = true
      // 指定秒数後にダイアログを閉じる
      setTimeout(() => {
        this.showFlg = false;
        this.nextPhase()
      }, 3500);
    }
  }
}
</script>

<style scoped>
.custom-text {
  font-size: 30px;
}
</style>
