<template>
   <v-container>
      <v-row
         ><v-col>
            <div class="mt-6">
               <span class="text-h2">Login</span>
            </div>
            <div class="mt-6 text-h4">
               Welcome back to Nuzlooke!
            </div>
            <div class="text-h6">
               Sign in with login information or use of the providers below
            </div>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import { isMobile } from 'mobile-device-detect';
import SpeedDial from '../components/SpeedDial.vue';

export default {
   name: 'Login',
   components: {
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {
         mobile: false,
         moduleOptions: [
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
   mounted() {
      this.mobile = isMobile;
   },
};
</script>

<style></style>
