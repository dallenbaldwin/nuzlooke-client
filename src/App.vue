<template>
   <v-app :class="mobile() ? '' : 'c-mw'">
      <v-app-bar elevation="1" bottom app v-if="mobile()">
         <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
         <v-spacer></v-spacer>
      </v-app-bar>
      <c-nav-drawer v-model="drawer"></c-nav-drawer>
      <v-main>
         <v-container>
            <router-view> </router-view>
            <pre>{{ JSON.stringify(this.$store.state, null, 2) }}</pre>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
//
import NavDrawer from './components/NavDrawer.vue';

export default {
   components: {
      'c-nav-drawer': NavDrawer,
   },
   name: 'App',
   data() {
      return { debug: true, drawer: false };
   },
};
</script>

<style scoped>
.c-mw {
   max-width: 60%;
   margin: auto;
}
</style>
