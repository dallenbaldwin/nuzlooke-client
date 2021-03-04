<template>
   <v-app>
      <v-app-bar elevation="1" bottom app>
         <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
         <v-spacer></v-spacer>
         <v-btn icon>
            <v-icon>mdi-filter</v-icon>
         </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" absolute bottom temporary>
         <v-list nav>
            <v-list-item-group
               v-model="group"
               active-class="deep-purple--text text--accent-4"
            >
               <v-list-item>
                  <v-list-item-title>Foo</v-list-item-title>
               </v-list-item>

               <v-list-item>
                  <v-list-item-title>Bar</v-list-item-title>
               </v-list-item>

               <v-list-item>
                  <v-list-item-title>Fizz</v-list-item-title>
               </v-list-item>

               <v-list-item>
                  <v-list-item-title>Buzz</v-list-item-title>
               </v-list-item>
            </v-list-item-group>
         </v-list>
      </v-navigation-drawer>

      <v-main>
         <v-container>
            <router-view></router-view>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
   export default {
      name: 'App',
      components: {},
      data: () => ({
         drawer: false,
         group: null,
      }),
      watch: {
         group() {
            this.drawer = false;
         },
      },
   };
</script>
