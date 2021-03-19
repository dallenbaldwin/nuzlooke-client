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
            <v-btn dark fab x-large @click.prevent.stop><v-icon>mdi-menu</v-icon></v-btn>
         </template>
         <!-- FIXME: this should just be a link with a settings icon. I don't think I'll be able to get it working the way i want -->
         <div v-if="isLoggedIn" class="v-btn--floating float-right">
            <span>{{ username }}</span>
            <v-btn fab x-small color="orange" dark>
               <v-icon>mdi-pencil</v-icon>
            </v-btn>
         </div>
         <v-btn
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
            :color="action.color ? action.color : undefined"
         >
            <v-icon>{{ action.icon }}</v-icon>
            <div class="c-fab-bottom-text">{{ action.label }}</div>
         </v-btn>
      </v-speed-dial>
   </div>
</template>

<script>
export default {
   name: 'SpeedDial',
   props: ['actions'],
   data() {
      return {
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
               label: 'Games',
               icon: 'mdi-format-list-bulleted',
               route: 'games',
               action: 'exit-game',
               requiresLoginAccess: true,
            },
            {
               label: 'Sign Out',
               icon: 'mdi-logout',
               action: 'logout',
               requiresLoginAccess: true,
            },
         ],
      };
   },
   methods: {
      linkActions(link) {
         if (link.action) this.$emit(link.action);
         // hacky fix
         if (link.route && link.route !== 'games') this.navigate({ name: link.route });
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
   z-index: 1000;
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
