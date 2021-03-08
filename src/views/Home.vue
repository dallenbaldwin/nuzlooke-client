<template>
   <v-container>
      <v-row>
         <v-col> <c-speed-dial :actions="null" v-if="!mobile()"></c-speed-dial></v-col>
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

export default {
   name: 'Home',
   components: {
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {};
   },
   methods: {},
   computed: {},
};
</script>
