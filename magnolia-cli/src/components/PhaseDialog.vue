<template>
  <v-dialog
    v-model="showFlg"
    width="auto"
    :light="true"
    persistent
  >
  <!-- <template v-slot:activator="{ props }">
    <v-btn
      color="primary"
      v-bind="props"
    >
      ターン終了
    </v-btn>
  </template> -->
  <v-card>
    <v-card-text>
      <span class="custom-text">{{ dialogMsg }}</span>
    </v-card-text>
    <v-card-actions>
      <!-- <v-btn color="primary" block @click="showFlg = false; $emit('closeDialog')">Close Dialog</v-btn> -->
      <!-- <v-btn color="primary" block @click="showFlg = false; nextPhase()">Close Dialog</v-btn> -->
    </v-card-actions>
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
        if (this.showFlg)
        this.showFlg = false;
        this.nextPhase()
      }, 1500);
    }
  }
}
</script>

<style scoped>
.custom-text {
  font-size: 50px;
}
</style>
