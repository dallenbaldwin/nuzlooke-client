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
         inGameRoutes: ['pokemon', 'routes', 'gyms', 'rules'],
         inGameLinks: ['Pokemon', 'Routes', 'Gyms', 'Rules', 'Games', 'Sign Out'],
         outGameLinks: ['Sign Out'],
         loggedOutLinks: ['Home', 'Sign In', 'Register'],
         links: [
            {
               label: 'Home',
               icon: 'mdi-home',
               route: 'home',
            },
            {
               label: 'Sign In',
               icon: 'mdi-login',
               route: 'login',
            },
            {
               label: 'Register',
               icon: 'mdi-account',
               route: 'register',
            },
            {
               label: 'Sign Out',
               icon: 'mdi-logout',
               route: 'home',
               action: 'logout',
            },
            {
               label: 'Pokemon',
               route: 'pokemon',
               icon: 'mdi-pokeball',
            },
            {
               label: 'Routes',
               route: 'routes',
               icon: 'mdi-routes',
            },
            {
               label: 'Gyms',
               route: 'gyms',
               icon: 'mdi-domain',
            },
            {
               label: 'Rules',
               route: 'rules',
               icon: 'mdi-book',
            },
            {
               label: 'Games',
               icon: 'mdi-format-list-bulleted',
               route: 'games',
               action: 'exit-game',
            },
         ],
      };
   },
   methods: {
      clickLink(link) {
         if (link.action) {
            this.reactToAction(link.action);
         } else if (this.inGameRoutes.includes(link.route)) {
            this.navigate({ name: link.route, params: { gameId: this.game.id } });
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
            .filter(link => {
               if (this.inGame) return this.inGameLinks.includes(link.label);
               else if (this.outGame) return this.outGameLinks.includes(link.label);
               else return this.loggedOutLinks.includes(link.label);
            });
      },
      inGame() {
         return this.$store.state.game !== null && this.$store.state.isLoggedIn;
      },
      outGame() {
         return this.$store.state.game === null && this.$store.state.isLoggedIn;
      },
      game() {
         return this.$store.state.game;
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
