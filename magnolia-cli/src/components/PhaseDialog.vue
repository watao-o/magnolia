<template>
  <v-dialog
    v-model="showFlg"
    width="auto"
    :light="true"
    persistent
  >
  <v-card>
    <v-card-text>
      <span class="custom-text">{{ dialogMsg }}</span>
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
      // 2秒後にダイアログを閉じる
      setTimeout(() => {
        this.showFlg = false;
        this.nextPhase()
      }, 1500);
    }
  }
}
</script>

<style scoped>
.custom-text {
  font-size: 30px;
}
</style>
