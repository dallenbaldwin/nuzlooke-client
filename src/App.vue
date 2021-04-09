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
import NavDrawer from './components/NavDrawer.vue';

export default {
   components: {
      'c-nav-drawer': NavDrawer,
   },
   name: 'App',
   data() {
      // TODO move speed dial into this view
      return { debug: true };
   },
};
</script>

<style scoped>
.c-mw {
   max-width: 80%;
   margin: auto;
}
</style>
