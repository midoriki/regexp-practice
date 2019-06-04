<template>
  <v-app>
    <v-toolbar dense>
      <v-toolbar-title>Regexp Practice</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn href="/me/" flat>Home</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <RegexBoard/>
    </v-content>
  </v-app>
</template>

<script>
import RegexBoard from './components/RegexBoard.vue';

export default {
  name: 'App',
  components: {
    RegexBoard
  },
  data () {
    return {
      //
    }
  }
}
</script>
