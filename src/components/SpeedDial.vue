<template>
   <div>
      <v-speed-dial
         open-on-hover
         top
         right
         direction="bottom"
         transition="scale-transition"
      >
         <template v-slot:activator>
            <v-btn dark fab x-large @click.prevent.stop
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
            class="mb-5"
         >
            <v-icon>{{ link.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ link.label }}</div>
         </v-btn>
         <v-btn
            fab
            v-for="action of actions"
            :key="action.label"
            dark
            @click="linkActions(action)"
            class="mb-5"
            :color="action.color"
         >
            <v-icon>{{ action.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ action.label }}</div>
         </v-btn>
      </v-speed-dial>
   </div>
</template>

<script>
import Icons from '../constants/Icons';
import Pages from '../constants/Pages';

export default {
   name: 'SpeedDial',
   props: ['actions'],
   data() {
      return {
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
               color: 'orange',
               action: 'open-settings',
               requiresLoginAccess: true,
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
      openSettings() {
         // TODO user settings
         alert('open settings!');
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
