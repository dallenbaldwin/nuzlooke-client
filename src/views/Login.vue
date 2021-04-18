<template>
   <v-container>
      <v-row>
         <v-col> <c-speed-dial v-if="!mobile()"></c-speed-dial></v-col>
      </v-row>
      <v-row>
         <v-col>
            <div class="text-h2">Login</div>
            <div class="mt-6 text-h4">
               Welcome back to Nuzlooke!
            </div>
            <div class="text-h6">
               Sign in with login information or use one of the providers below
            </div>
         </v-col>
      </v-row>
      <v-row class="d-flex justify-center" :class="mobile() ? 'flex-column' : 'flex-row'">
         <c-login-providers></c-login-providers>
         <v-divider
            v-if="mobile()"
            class="ma-3"
            inset
            style="max-width:100%;"
         ></v-divider>
         <v-divider v-if="!mobile()" class="ma-3" inset vertical></v-divider>
         <c-user-pass></c-user-pass>
      </v-row>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';
import LoginProviders from '../components/auth/LoginProviders.vue';
import UserPass from '../components/auth/UserPass.vue';

export default {
   name: 'Login',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
      'c-login-providers': LoginProviders,
      'c-user-pass': UserPass,
   },
   data() {
      return {};
   },
   computed: {},
};
</script>

<style></style>
