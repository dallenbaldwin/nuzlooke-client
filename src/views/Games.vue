<template>
   <v-container>
      <c-nav-drawer v-model="drawer" :links="links"></c-nav-drawer>
      <v-row>
         <v-col>
            <c-speed-dial
               :links="links"
               v-if="!mobile"
               v-on:logout="logout"
               v-on:filter-games="filterGames"
               v-on:create-game="createGame"
            ></c-speed-dial
         ></v-col>
      </v-row>
      <v-row
         ><v-col>
            <div class="mt-6 text-h2">
               Games
            </div>
         </v-col>
      </v-row>
      <v-row>
         <v-col v-if="!mobile" cols="1"></v-col>
         <v-col :cols="mobile ? 12 : 10">
            <v-expansion-panels popout>
               <v-expansion-panel v-for="game of games" :key="game.id">
                  <v-expansion-panel-header
                     expand-icon="mdi-controller-classic"
                     disable-icon-rotate
                     class="text-h6"
                     >{{ game.name }}
                     <div class="ml-3">
                        <v-btn
                           fab
                           x-small
                           color="warning"
                           @click.stop="editGameName(game.id)"
                        >
                           <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                     </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                     <v-container>
                        <v-row>
                           <v-col
                              ><div>
                                 {{ game.version.name }}
                              </div>
                              <v-skeleton-loader type="image@1"></v-skeleton-loader>
                           </v-col>
                           <v-col
                              ><div class="text">Party</div>
                              <v-skeleton-loader type="avatar@6"></v-skeleton-loader>
                           </v-col>
                           <v-col
                              ><div class="text">Gym Badges</div>
                              <v-skeleton-loader type="avatar@8"></v-skeleton-loader>
                           </v-col>
                           <v-col>
                              <div class="text">Game Links</div>
                              <div class="mt-2">
                                 <v-btn
                                    fab
                                    dark
                                    small
                                    @click="toRoute('pokemon', game.id)"
                                    ><v-icon>mdi-pokeball</v-icon></v-btn
                                 >
                                 <span class="ml-3">Pokemon</span>
                              </div>
                              <div class="mt-2">
                                 <v-btn fab dark small @click="toRoute('rules', game.id)"
                                    ><v-icon>mdi-book</v-icon></v-btn
                                 >
                                 <span class="ml-3">Rules</span>
                              </div>
                              <div class="mt-2">
                                 <v-btn fab dark small @click="toRoute('routes', game.id)"
                                    ><v-icon>mdi-routes</v-icon></v-btn
                                 >
                                 <span class="ml-3">Routes</span>
                              </div>
                              <div class="mt-2">
                                 <v-btn fab dark small @click="toRoute('gyms', game.id)"
                                    ><v-icon>mdi-domain</v-icon></v-btn
                                 >
                                 <span class="ml-3">Gyms</span>
                              </div>
                           </v-col>
                        </v-row>
                     </v-container>
                  </v-expansion-panel-content>
               </v-expansion-panel>
            </v-expansion-panels>
         </v-col>
         <v-col v-if="!mobile" cols="1"></v-col>
      </v-row>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/SpeedDial.vue';

export default {
   name: 'Games',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {
         links: [
            {
               label: 'Sign Out',
               icon: 'mdi-logout',
               route: 'home',
               dark: true,
               action: 'logout',
            },
            {
               label: 'Filter',
               icon: 'mdi-filter',
               route: null,
               dark: true,
               action: 'filter-games',
               color: 'primary',
            },
            {
               label: 'Create Game',
               icon: 'mdi-plus',
               route: null,
               dark: true,
               action: 'create-game',
               color: 'green',
            },
         ],
         games: [
            {
               id: 123214,
               name: 'dummy name 1',
               icon: 'mdi-gamepad',
               version: { name: 'dummy version' },
            },
            {
               id: 35123,
               name: 'dummy name 2',
               icon: 'mdi-gamepad',
               version: { name: 'dummy version' },
            },
            {
               id: 52343,
               name: 'dummy name 3',
               icon: 'mdi-gamepad',
               version: { name: 'dummy version' },
            },
            {
               id: 35234,
               name: 'dummy name 4',
               icon: 'mdi-gamepad',
               version: { name: 'dummy version' },
            },
         ],
      };
   },
   methods: {
      filterGames() {
         alert('i want to filter my games!');
      },
      createGame() {
         alert('i want to create a game!');
      },
      editGameName(gameId) {
         alert(`i want to edit gameId: ${gameId}`);
      },
      toRoute(route, gameId) {
         this.$store.commit(
            'selectGame',
            this.games.find(game => game.id === gameId)
         );
         this.navigate({
            name: route,
            params: { gameId: gameId },
         });
      },
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
