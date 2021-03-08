<template>
   <v-container>
      <v-row>
         <v-col>
            <c-speed-dial
               :actions="actions"
               v-if="!mobile()"
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
            <div class="mt-6 text-h4">Welcome back {{ username }}</div>
         </v-col>
      </v-row>
      <v-row>
         <v-col>
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
                              <div v-for="btn of gameBtns" :key="btn.label">
                                 <div class="mt-2">
                                    <v-btn
                                       fab
                                       dark
                                       small
                                       @click="toGame(btn.route, game.id)"
                                       ><v-icon>{{ btn.icon }}</v-icon></v-btn
                                    >
                                    <span class="ml-3">{{ btn.label }}</span>
                                 </div>
                              </div>
                           </v-col>
                        </v-row>
                     </v-container>
                  </v-expansion-panel-content>
               </v-expansion-panel>
            </v-expansion-panels>
         </v-col>
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
         actions: [
            {
               label: 'Filter',
               icon: 'mdi-filter',
               action: 'filter-games',
               color: 'primary',
            },
            {
               label: 'Create Game',
               icon: 'mdi-plus',
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
         gameBtns: [
            { label: 'Pokemon', route: 'pokemon', icon: 'mdi-pokeball' },
            { label: 'Routes', route: 'routes', icon: 'mdi-routes' },
            { label: 'Gyms', route: 'gyms', icon: 'mdi-domain' },
            { label: 'Rules', route: 'rules', icon: 'mdi-book' },
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
      toGame(route, gameId) {
         this.$store.commit(
            'selectGame',
            this.games.find(game => game.id === gameId)
         );
         if (this.mobile()) {
            this.navigate({
               name: route,
               params: { gameId: gameId },
            });
         } else {
            this.navigate({ name: 'game', params: { gameId: gameId, tab: route } });
         }
      },
   },
   computed: {
      username() {
         return this.$store.state.username;
      },
   },
};
</script>

<style></style>
