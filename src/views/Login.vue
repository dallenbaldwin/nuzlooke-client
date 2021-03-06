<template>
   <v-container>
      <c-nav-drawer v-model="drawer" :links="links"></c-nav-drawer>
      <v-row>
         <v-col> <c-speed-dial :links="links" v-if="!mobile"></c-speed-dial></v-col>
      </v-row>
      <v-row
         ><v-col>
            <div class="mt-6 text-h2">Login</div>
            <div class="mt-6 text-h4">
               Welcome back to Nuzlooke!
            </div>
            <div class="text-h6">
               Sign in with login information or use of the providers below
            </div>
         </v-col>
      </v-row>
      <v-row>
         <v-col><c-login-providers></c-login-providers> </v-col>
         <v-divider vertical v-if="!mobile"></v-divider>
         <v-col v-if="!mobile">
            <v-btn @click="login">games</v-btn>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';
import LoginProviders from '../components/LoginProviders.vue';

export default {
   name: 'Login',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
      'c-login-providers': LoginProviders,
   },
   data() {
      return {
         links: [
            {
               label: 'Home',
               icon: 'mdi-home',
               route: 'home',
               dark: true,
            },
            {
               label: 'Register',
               icon: 'mdi-account',
               route: 'register',
               dark: true,
            },
         ],
      };
   },
   computed: {
      drawer() {
         return this.$store.state.drawer;
      },
      mobile() {
         return this.$store.state.mobile;
      },
   },
};
</script>

<style></style>
