<template>
   <v-app :class="mobile() ? '' : 'c-mw'">
      <c-nav-drawer></c-nav-drawer>
      <v-main>
         <v-container>
            <router-view> </router-view>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
// <pre>{{ JSON.stringify(this.$store.state, null, 2) }}</pre>
import NavDrawer from './components/NavDrawer.vue';

export default {
   components: {
      'c-nav-drawer': NavDrawer,
   },
   name: 'App',
   data() {
      return { debug: true };
   },
};
</script>

<style scoped>
.c-mw {
   max-width: 60%;
   margin: auto;
}
</style>
