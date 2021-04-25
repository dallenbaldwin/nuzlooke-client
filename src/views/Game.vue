<template>
   <v-container class="fill-height">
      <v-row>
         <c-speed-dial
            v-if="!mobile()"
            v-on:logout="logout"
            v-on:exit-game="exitGame"
            v-on:add="createRule"
            v-on:filter="openFilter"
            :finished="gameFinished"
            :tab="tab"
         ></c-speed-dial>
      </v-row>
      <v-row class="mt-6 pt-6">
         <div class="text-h2">
            {{ game.label }}
         </div>
      </v-row>
      <v-row class="mt-6 mb-3">
         <v-tabs v-model="tab" icons-and-text grow :color="Colors.grey.darken4">
            <v-tab v-for="tab of tabs" :key="tab.label">
               {{ tab.label }}
               <v-icon dark>{{ tab.icon }}</v-icon>
            </v-tab>
         </v-tabs>
      </v-row>
      <component style="width: 100%" :is="currentTabComponent" ref="eventBus"></component>
   </v-container>
</template>

<script>
import NavDrawer from '../components/NavDrawer.vue';
import SpeedDial from '../components/speed-dial/SpeedDial.vue';
import TabMap from '../constants/TabMap';
import Icons from '../constants/Icons';
import Pokemon from './Pokemon';
import Routes from './Routes';
import Gyms from './Gyms';
import Rules from './Rules';
import * as authController from '../controllers/auth';
import * as gameController from '../controllers/game';

export default {
   name: 'Game',
   components: {
      'c-nav-drawer': NavDrawer,
      'c-speed-dial': SpeedDial,
   },
   data() {
      return {
         filter: false,
         tab: null,
         tabs: [
            { label: 'Pokemon', icon: Icons.PAGES.POKEMON },
            { label: 'Routes', icon: Icons.PAGES.ROUTES },
            { label: 'Gyms', icon: Icons.PAGES.GYMS },
            { label: 'Rules', icon: Icons.PAGES.RULES },
         ],
      };
   },
   computed: {
      currentTabComponent() {
         if (this.tab === TabMap.POKEMON) return Pokemon;
         if (this.tab === TabMap.ROUTES) return Routes;
         if (this.tab === TabMap.GYMS) return Gyms;
         if (this.tab === TabMap.RULES) return Rules;
      },
      game() {
         return this.$store.state.game;
      },
      gameFinished() {
         return this.$store.state.game.is_finished;
      },
   },
   methods: {
      toTab(routeName) {
         return Object.values(TabMap).findIndex(route => route === routeName);
      },
      toRoute(tabIndex) {
         return TabMap[tabIndex];
      },
      createRule() {
         this.$refs.eventBus.clickAdd();
      },
      openFilter() {
         this.$refs.eventBus.clickFilter();
      },
      logout() {
         authController.logout();
      },
      exitGame() {
         gameController.exitGame();
      },
   },
   mounted() {
      this.tab = this.$route.params.tab;
   },
};
</script>

<style></style>
