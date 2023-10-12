<template>
  <v-dialog v-model="showFlg" width="500" :light="true" persistent>
    <v-card>
      <v-card-text>
        <span class="custom-text">{{ dialogMsg }}</span>
        <v-row class="py-3">
          <v-col cols="4" class="border my-back">
            <span class="custom-text">Player</span>
          </v-col>
          <v-col cols="4" class="border my-back">
            <span class="custom-text">VP</span>
          </v-col>
        </v-row>
        <v-list class="pa-0 pt-6 transparent-list">
          <v-list-item
            v-for="(user, index) in room.users ? room.users : []"
            :key="index"
            class="pa-0"
          >
            <v-row class="py-2">
              <v-col cols="4" class="border">
                <span class="custom-text">{{ user.name }}</span>
              </v-col>
              <v-col cols="2" class="border">
                <span class="custom-text">{{ user.status.vp }}</span>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'resultDialog',
  props: {
    room: { type: Object }
  },
  data () {
    return {
      showFlg: false,
      dialogMsg: 'ゲーム終了です！！'
    }
  },
  methods: {
    openDialog () {
      this.showFlg = true
      // setTimeout(() => {
      //   if (this.showFlg)
      //   this.showFlg = false;
      // }, 30000);
    }
  }
}
</script>

<style scoped>
.custom-text {
  font-size: 25px;
}

.border {
  border: 1px solid black;
  border-radius: 15px;
}
.my-back {
  background-color: rgb(120, 236, 151);
}
</style>
