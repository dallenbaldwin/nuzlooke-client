<template>
   <v-container>
      <c-nav-drawer v-model="drawer" :links="links"></c-nav-drawer>
      <v-row>
         <v-col> <c-speed-dial :links="links" v-if="!mobile"></c-speed-dial></v-col>
      </v-row>
      <v-row
         ><v-col>
            <div class="text-h2 text-center">Nuzlooke</div>
            <div class="mt-6 text-h4 text-center">A Nuzlocke Manager</div>
            <v-divider class="mt-6 mx-auto" inset></v-divider>
            <div class="mt-6 text-center">
               <v-btn x-large @click="navigate({ name: 'login' })">
                  Sign In
                  <v-icon large class="ml-3">mdi-login</v-icon>
               </v-btn>
            </div>
            <div class="mt-6 text-center">
               <v-btn x-large @click="navigate({ name: 'register' })"
                  >Register
                  <v-icon large class="ml-3">mdi-account</v-icon>
               </v-btn>
            </div>
            <v-divider class="mt-6 mx-auto" inset></v-divider> </v-col
      ></v-row>
   </v-container>
</template>

<script>
import SpeedDial from '../components/SpeedDial.vue';
import NavDrawer from '../components/NavDrawer.vue';

export default {
   name: 'Home',
   components: {
      'c-speed-dial': SpeedDial,
      'c-nav-drawer': NavDrawer,
   },
   data() {
      return {
         links: [
            {
               label: 'Sign In',
               icon: 'mdi-login',
               route: 'login',
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
   methods: {},
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
