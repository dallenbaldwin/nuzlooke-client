<template>
   <v-app>
      <v-app-bar elevation="1" bottom app v-if="mobile">
         <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
         <v-spacer></v-spacer>
         <v-btn icon>
            <v-icon>mdi-filter</v-icon>
         </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute dark bottom temporary v-if="mobile">
         <v-list-item v-if="isLoggedIn">
            <v-list-item-icon>
               <v-btn fab x-small color="orange" dark>
                  <v-icon>mdi-pencil</v-icon>
               </v-btn>
            </v-list-item-icon>
            <v-list-item-content>
               {{ username }}
            </v-list-item-content>
         </v-list-item>
         <v-divider></v-divider>
         <v-list nav>
            <v-list-item
               v-for="link of links.filter(
                  l => l.loginAccess === isLoggedIn && l.route !== currentRoute
               )"
               :key="link"
               link
               @click="navigate(link.route)"
            >
               <v-list-item-icon>
                  <v-icon>{{ link.icon }}</v-icon>
               </v-list-item-icon>
               <v-list-item-content>
                  {{ link.label }}
               </v-list-item-content>
            </v-list-item>
         </v-list>
      </v-navigation-drawer>

      <v-main>
         <v-container>
            <div v-if="!mobile">
               <v-speed-dial bottom right direction="left" transition="scale-transition">
                  <template v-slot:activator>
                     <v-btn dark fab @click="speed"><v-icon>mdi-menu</v-icon></v-btn>
                  </template>
                  <v-btn fab x-small color="orange" dark>
                     <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <div>{{ username }}</div>
               </v-speed-dial>
               <v-speed-dial
                  open-on-hover
                  top
                  right
                  direction="bottom"
                  transition="scale-transition"
               >
                  <template v-slot:activator>
                     <v-btn dark fab @click.prevent.stop><v-icon>mdi-menu</v-icon></v-btn>
                  </template>
                  <v-btn
                     fab
                     small
                     v-for="link of links.filter(
                        l => l.loginAccess === isLoggedIn && l.route !== currentRoute
                     )"
                     :key="link"
                     :dark="link.dark"
                     @click="navigate(link.route)"
                     @mouseover="speed = !speed"
                  >
                     <v-tooltip>{{ link.label }}</v-tooltip>
                     <v-icon>{{ link.icon }}</v-icon>
                  </v-btn>
               </v-speed-dial>
            </div>
            <router-view></router-view>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
import { isMobile } from 'mobile-device-detect';
import SpeedDial from './components/SpeedDial.vue';

export default {
   name: 'App',
   components: {
      'c-speed-dial': SpeedDial,
   },
   data: () => ({
      mobile: false,
      speed: false,
      drawer: false,
      group: null,
      currentRoute: null,
      actions: [
         {
            label: 'Create Game',
            icon: 'mdi-plus',
            loginAccess: true,
            route: null,
            action: 'create-game',
         },
         {
            label: 'Create Rule',
            icon: 'mdi-plus',
            loginAccess: true,
            route: null,
            action: 'create-rule',
         },
      ],
      links: [
         {
            label: 'Home',
            icon: 'mdi-home',
            loginAccess: false,
            route: 'home',
         },
         {
            label: 'Sign In',
            icon: 'mdi-login',
            loginAccess: false,
            route: 'login',
         },
         {
            label: 'Register',
            icon: 'mdi-account',
            loginAccess: false,
            route: 'register',
         },
         {
            label: 'Games',
            icon: 'mdi-format-list-bulleted',
            loginAccess: true,
            route: null,
         },
         { label: 'Pokemon', icon: 'mdi-pokeball', loginAccess: true, route: null },
         { label: 'Rules', icon: 'mdi-book', loginAccess: true, route: null },
         { label: 'Routes', icon: 'mdi-routes', loginAccess: true, route: null },
         { label: 'Gyms', icon: 'mdi-domain', loginAccess: true, route: null },
      ],
   }),
   computed: {
      game() {
         return this.$store.state.game;
      },
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      username() {
         return this.$store.state.username;
      },
   },
   methods: {
      navigate(endpoint) {
         this.$router.replace({ name: endpoint });
         this.currentRoute = endpoint;
      },
   },
   watch: {
      group() {
         this.drawer = false;
      },
   },
   mounted() {
      this.mobile = isMobile;
      this.currentRoute = this.$route.name || 'home';
   },
};
</script>

<style scoped>
.v-speed-dial {
   position: absolute;
}

.v-btn--floating {
   position: relative;
}
</style>
