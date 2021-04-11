<template>
   <div>
      <v-speed-dial top right direction="bottom" transition="scale-transition">
         <template v-slot:activator>
            <v-btn dark fab x-large @click.prevent
               ><v-icon>{{ Icons.CONTROLS.MENU }}</v-icon></v-btn
            >
         </template>
         <v-btn
            :color="link.color"
            fab
            v-for="link of pageLinks"
            :key="link.label"
            dark
            @click="linkActions(link)"
            class="ma-4"
         >
            <v-icon>{{ link.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ link.label }}</div>
         </v-btn>
         <v-btn
            :disabled="action.disabled"
            fab
            v-for="action of actions"
            :key="action.label"
            @click="linkActions(action)"
            class="ma-4 white--text"
            :color="action.color"
         >
            <v-icon>{{ action.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ action.label }}</div>
         </v-btn>
      </v-speed-dial>
      <v-dialog v-model="appSettings" width="500">
         <c-app-settings v-on:close-dialog="appSettings = !appSettings"></c-app-settings>
      </v-dialog>
   </div>
</template>

<script>
import ProgressSpinner from './ProgressSpinner.vue';
import TextField from './form-controls/TextField.vue';
import AppSettings from './dialogs/AppSettings.vue';
import Errors from './Errors.vue';
import Icons from '../constants/Icons';
import Pages from '../constants/Pages';
import colors from 'vuetify/lib/util/colors';

export default {
   name: 'SpeedDial',
   props: {
      actions: { required: true },
      finished: { required: false, default: false },
   },
   components: {
      'c-progress-spinner': ProgressSpinner,
      'c-error': Errors,
      'c-text-field': TextField,
      'c-app-settings': AppSettings,
   },
   data() {
      return {
         appSettings: false,
         links: [
            {
               label: 'Home',
               icon: Icons.PAGES.HOME,
               route: Pages.HOME,
               requiresLoginAccess: false,
            },
            {
               label: 'Sign In',
               icon: Icons.PAGES.LOGIN,
               route: Pages.LOGIN,
               requiresLoginAccess: false,
            },
            {
               label: 'Register',
               icon: Icons.PAGES.REGISTER,
               route: Pages.REGISTER,
               requiresLoginAccess: false,
            },
            {
               label: 'Settings',
               icon: Icons.CONTROLS.SETTINGS,
               action: 'open-settings',
               requiresLoginAccess: true,
               color: colors.grey.darken2,
            },
            {
               label: 'Games',
               icon: Icons.PAGES.GAMES,
               route: Pages.GAMES,
               action: 'exit-game',
               requiresLoginAccess: true,
            },
            {
               label: 'Sign Out',
               icon: Icons.CONTROLS.LOGOUT,
               action: 'logout',
               requiresLoginAccess: true,
            },
         ],
      };
   },
   methods: {
      openSettings() {
         this.appSettings = !this.appSettings;
      },
      linkActions(link) {
         if (link.action) this.$emit(link.action);
         if (link.action === 'open-settings') {
            this.openSettings();
            return;
         }
         // hacky fix
         if (link.route && link.route !== Pages.GAMES)
            this.navigate({ name: link.route });
      },
   },
   computed: {
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      username() {
         return this.$store.state.username;
      },
      pageLinks() {
         return this.links
            .filter(link => link.route !== this.$route.name)
            .filter(link => link.requiresLoginAccess === this.isLoggedIn);
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

.c-fab-bottom-text {
   position: absolute;
   top: 35px;
   color: #272727;
   padding: 10px;
}
</style>
