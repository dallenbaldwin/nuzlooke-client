<template>
   <div>
      <v-speed-dial top right direction="bottom" transition="scale-transition">
         <template v-slot:activator>
            <v-btn dark fab x-large @click.prevent
               ><v-icon>{{ Icons.CONTROLS.MENU }}</v-icon></v-btn
            >
         </template>
         <c-fab-btn
            v-show="btnSupport[link.btnSupport].includes(currentPage)"
            :color="link.color"
            v-for="(link, i) of links"
            :key="i"
            @click="goTo(link.route)"
            :icon="link.icon"
            :label="link.label"
            :disabled="false"
         ></c-fab-btn>
         <c-fab-btn
            v-show="btnSupport.GAMES.includes(currentPage)"
            :icon="Icons.PAGES.GAMES"
            label="games"
            @click="$emit('exit-game')"
         ></c-fab-btn>
         <!-- TODO logout is global. should probably change that to be controller based -->
         <c-fab-btn
            v-show="btnSupport.LOGOUT.includes(currentPage)"
            label="sign out"
            :icon="Icons.CONTROLS.LOGOUT"
            @click="logout"
         ></c-fab-btn>
         <c-fab-btn
            v-show="btnSupport.APPSETTINGS.includes(currentPage)"
            label="settings"
            :icon="Icons.CONTROLS.SETTINGS"
            :color="Colors.grey.darken2"
            @click="settings = !settings"
         ></c-fab-btn>
         <c-fab-btn
            v-show="btnSupport.FILTER.includes(currentPage)"
            label="filter"
            :icon="Icons.CONTROLS.FILTER"
            color="primary"
            @click="$emit('filter')"
         ></c-fab-btn>
         <!-- FIXME can only create rules on rules tab -->
         <c-fab-btn
            v-show="btnSupport.ADD.includes(currentPage)"
            :disabled="finished"
            :label="toCreate()"
            :icon="Icons.CONTROLS.PLUS"
            color="success"
            @click="$emit('add')"
         ></c-fab-btn>
      </v-speed-dial>
      <v-dialog v-model="settings" width="500">
         <app-settings v-on:close-dialog="settings = !settings"></app-settings>
      </v-dialog>
   </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import TextField from './form-controls/TextField.vue';
import Button from './Button.vue';
import Errors from './Errors.vue';
import Icons from '../constants/Icons';
import Pages from '../constants/Pages';
import colors from 'vuetify/lib/util/colors';
import FabBtn from './speed-dial/FabBtn.vue';

export default {
   name: 'SpeedDial',
   props: {
      finished: { required: false, default: false },
   },
   components: {
      AppSettings: () => import('./dialogs/AppSettings.vue'),
      'c-progress-spinner': ProgressSpinner,
      'c-error': Errors,
      'c-text-field': TextField,
      'c-btn': Button,
      'c-fab-btn': FabBtn,
   },
   data() {
      return {
         settings: false,
         btnSupport: {
            FILTER: [Pages.GAMES, Pages.GAME],
            ADD: [Pages.GAMES, Pages.GAME],
            APPSETTINGS: [Pages.GAMES, Pages.GAME],
            LOGOUT: [Pages.GAME, Pages.GAMES],
            HOME: [Pages.LOGIN, Pages.REGISTER],
            SIGNIN: [Pages.HOME, Pages.REGISTER],
            REGISTER: [Pages.HOME, Pages.LOGIN],
            GAMES: [Pages.GAME],
         },
         links: [
            {
               label: 'Home',
               icon: Icons.PAGES.HOME,
               route: Pages.HOME,
               btnSupport: 'HOME',
            },
            {
               label: 'Sign In',
               icon: Icons.PAGES.LOGIN,
               route: Pages.LOGIN,
               btnSupport: 'SIGNIN',
            },
            {
               label: 'Register',
               icon: Icons.PAGES.REGISTER,
               route: Pages.REGISTER,
               btnSupport: 'REGISTER',
            },
         ],
      };
   },
   methods: {
      toCreate() {
         // this will have to be refactored if we add more creates
         if (this.currentPage === 'games') return 'create game';
         else if (this.currentPage === 'game') return 'create rule';
      },
      goTo(route) {
         this.navigate({ name: route });
      },
   },
   computed: {
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      currentPage() {
         return this.$route.name;
      },
   },
};
</script>

<style scoped>
.v-speed-dial {
   position: absolute;
   z-index: 2;
}

.v-btn--floating {
   position: relative;
}
</style>
