<template>
   <v-app :class="mobile() ? '' : 'c-mw'">
      <c-nav-drawer
         v-if="mobile() && notHome"
         v-on:add="navClickAdd"
         v-on:filter="navClickFilter"
      ></c-nav-drawer>
      <v-main>
         <v-container>
            <v-snackbar bottom :value="updateExists" :timeout="-1" color="primary">
               An update is available!
               <c-btn :icon="Icons.CONTROLS.EXCLAIM" color="success" @click="refreshApp"
                  >update</c-btn
               >
            </v-snackbar>
            <router-view ref="eventBus"> </router-view>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
import ButtonVue from './components/Button.vue';
import NavDrawer from './components/NavDrawer.vue';
import Pages from './constants/Pages';
import swUpdate from './mixins/swUpdate';

export default {
   components: {
      'c-nav-drawer': NavDrawer,
      'c-btn': ButtonVue,
   },
   mixins: [swUpdate],
   name: 'App',
   data() {
      return { debug: true };
   },
   computed: {
      notHome() {
         return this.$route.name != Pages.HOME;
      },
   },
   methods: {
      navClickAdd() {
         this.$refs.eventBus.clickAdd();
      },
      navClickFilter() {
         this.$refs.eventBus.clickFilter();
      },
   },
};
</script>

<style>
.c-mw {
   max-width: 80%;
   margin: auto;
}
/* these have to be here if i'm using a toolbar and bottom app-bar at the same time */
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
