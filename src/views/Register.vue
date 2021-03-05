<template>
   <v-container>
      <v-row
         ><v-col>
            <div class="mt-6">
               <span class="text-h2">Register</span>
            </div>
            <div class="mt-6 text-h4">
               Welcome to Nuzlooke!
            </div>
            <div class="text-h6">
               Register with login information or use of the providers below
            </div>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
import { isMobile } from 'mobile-device-detect';
import SpeedDial from '../components/SpeedDial.vue';

export default {
   name: 'Register',
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
               label: 'Login',
               icon: 'mdi-login',
               route: 'login',
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
