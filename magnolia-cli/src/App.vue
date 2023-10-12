<template>
  <v-app>
    <v-main>
      <Magnolia/>
    </v-main>
  </v-app>
</template>

<script>
import Magnolia from './components/Magnolia.vue'

export default {
  name: 'App',

  components: {
    Magnolia
  },

  data: () => ({
    //
  })
}
</script>
