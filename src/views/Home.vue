<template>
   <v-container>
      <v-row>
         <v-col><c-speed-dial :actions="null" v-if="!mobile()"></c-speed-dial></v-col>
      </v-row>
      <v-row>
         <v-col>
            <div class="text-h2 text-center">Nuzlooke</div>
            <div class="mt-6 text-h4 text-center">A Nuzlocke Manager</div>
            <v-divider class="mt-6 mx-auto" inset></v-divider>
            <div class="mt-6 text-center">
               <v-btn x-large @click="navigate({ name: Pages.LOGIN })">
                  <v-icon large class="mr-3">{{ Icons.PAGES.LOGIN }}</v-icon>
                  Sign In
               </v-btn>
            </div>
            <div class="mt-6 text-center">
               <v-btn x-large @click="navigate({ name: Pages.REGISTER })">
                  <v-icon large class="mr-3">{{ Icons.PAGES.REGISTER }}</v-icon>
                  Register
               </v-btn>
            </div>
            <v-divider class="mt-6 mx-auto" inset></v-divider>
         </v-col>
      </v-row>
      <v-row>
         <v-col></v-col>
         <v-col>
            <p>
               Nuzlooke | A Nuzlocke Manager aims to be the best Nuzlocke companion
               application out there.
            </p>
            <div class="text-h4">Features</div>
            <v-list>
               <v-list-item v-for="feature of features" :key="feature.icon">
                  <v-list-item-icon
                     ><v-icon>{{ feature.icon }}</v-icon></v-list-item-icon
                  >
                  <v-list-item-content>
                     <v-list-item-subtitle>{{ feature.text }}</v-list-item-subtitle>
                  </v-list-item-content>
               </v-list-item>
            </v-list>
         </v-col>
         <v-col></v-col>
      </v-row>
   </v-container>
</template>

<script>
import SpeedDial from '../components/SpeedDial.vue';
import Icons from '../constants/Icons.js';

export default {
   name: 'Home',
   components: {
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {
         features: [
            {
               text: 'Progressive Web Application',
               icon: Icons.CONSOLES.DESKTOP,
            },
            {
               text: 'Concurrent Games',
               icon: Icons.PAGES.GAMES,
            },
            {
               text: 'Multiple Supported Game Versions',
               icon: Icons.CONSOLES.SWITCH,
            },
            {
               text: 'Party, Storage, and Graveyard Manager',
               icon: Icons.PAGES.POKEMON,
            },
            {
               text: 'Rules Manager',
               icon: Icons.PAGES.RULES,
            },
            {
               text: 'Routes Manager',
               icon: Icons.PAGES.ROUTES,
            },
            {
               text: 'Gym Reference',
               icon: Icons.PAGES.GYM,
            },
         ],
      };
   },
   methods: {},
   computed: {},
};
</script>
