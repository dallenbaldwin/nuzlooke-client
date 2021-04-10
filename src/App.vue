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
      return { debug: true };
   },
};
</script>

<style>
.c-mw {
   max-width: 80%;
   margin: auto;
}
/* if the app bar bugs out and goes up top again... run this real quick */
.v-app-bar.v-app-bar--fixed {
   position: fixed;
   bottom: 0;
   z-index: 5;
}
.v-toolbar.v-toolbar--bottom {
   top: initial;
   bottom: 0;
}
</style>
