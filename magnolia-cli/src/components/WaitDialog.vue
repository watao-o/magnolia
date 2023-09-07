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
      {{ dialogMsg }}
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
  name: 'waitDialog',
  props: {
  },
  data () {
    return {
      showFlg: false,
      dialogMsg: '他のプレーヤの処理を待っています。'
    }
  },
  methods: {
    openDialog() {
      this.showFlg = true
    },
    closeDialog(){
      this.showFlg = false
    }
  }
}
</script>