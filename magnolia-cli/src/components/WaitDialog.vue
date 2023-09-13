<template>
  <v-dialog
    v-model="showFlg"
    width="600"
    :light="true"
    persistent
  >
  <v-card>
    <v-card-text>
      {{ dialogMsg }}
    </v-card-text>
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