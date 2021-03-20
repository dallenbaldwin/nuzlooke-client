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
// <pre>{{ prettySON(this.$store.state) }}</pre>
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
   max-width: 1000px;
   margin: auto;
}
</style>
