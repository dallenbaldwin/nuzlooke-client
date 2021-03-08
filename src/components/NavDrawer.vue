<template>
   <v-navigation-drawer :value="value" absolute bottom temporary>
      <v-list-item v-if="isLoggedIn">
         <v-list-item-icon>
            <v-btn fab x-small color="orange" dark @click="editUsername">
               <v-icon>mdi-pencil</v-icon>
            </v-btn>
         </v-list-item-icon>
         <v-list-item-content>
            {{ username }}
         </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list nav>
         <v-list-item
            v-for="link of pageLinks"
            :key="link.label"
            link
            @click="clickLink(link)"
         >
            <v-list-item-icon>
               <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="text-right">
               {{ link.label }}
            </v-list-item-content>
         </v-list-item>
      </v-list>
   </v-navigation-drawer>
</template>

<script>
export default {
   name: 'NavDrawer',
   props: ['value'],
   model: {
      prop: 'value',
      event: 'valueChange',
   },
   data() {
      return {
         gameLinks: ['Pokemon', 'Routes', 'Gyms', 'Rules', 'Games'],
         links: [
            {
               label: 'Home',
               icon: 'mdi-home',
               route: 'home',
               requiresLoginAccess: false,
            },
            {
               label: 'Sign In',
               icon: 'mdi-login',
               route: 'login',
               requiresLoginAccess: false,
            },
            {
               label: 'Register',
               icon: 'mdi-account',
               route: 'register',
               requiresLoginAccess: false,
            },
            {
               label: 'Pokemon',
               route: 'pokemon',
               icon: 'mdi-pokeball',
               requiresLoginAccess: true,
            },
            {
               label: 'Routes',
               route: 'routes',
               icon: 'mdi-routes',
               requiresLoginAccess: true,
            },
            {
               label: 'Gyms',
               route: 'gyms',
               icon: 'mdi-domain',
               requiresLoginAccess: true,
            },
            {
               label: 'Rules',
               route: 'rules',
               icon: 'mdi-book',
               requiresLoginAccess: true,
            },
            {
               label: 'Games',
               icon: 'mdi-format-list-bulleted',
               route: 'games',
               action: 'exit-game',
               requiresLoginAccess: true,
            },
            {
               label: 'Sign Out',
               icon: 'mdi-logout',
               route: 'home',
               action: 'logout',
               requiresLoginAccess: true,
            },
         ],
      };
   },
   methods: {
      clickLink(link) {
         if (link.action) {
            this.reactToAction(link.action);
         } else if (this.gameLinks.includes(link.route)) {
            this.navigate({ name: link.route, params: { gameId: game.id } });
         } else {
            this.navigate({ name: link.route });
         }
      },
      reactToAction(action) {
         if (action === 'logout') {
            this.logout();
         } else if (action === 'exit-game') {
            this.exitGame();
         }
      },
      editUsername() {
         alert('i want to edit the username!');
      },
   },
   computed: {
      valueLocal: {
         get() {
            return this.value;
         },
         set(val) {
            this.$emit('valueChange', val);
         },
      },
      pageLinks() {
         return this.links
            .filter(link => link.route !== this.$route.name)
            .filter(link => link.requiresLoginAccess === this.isLoggedIn);
      },
      game() {
         return this.$store.state.game;
      },
      gameExists() {
         return this.$store.state.game !== null;
      },
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      username() {
         return this.$store.state.username;
      },
   },
};
</script>

<style></style>
