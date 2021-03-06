<template>
   <v-navigation-drawer :value="drawer" absolute bottom>
      <v-list-item v-if="isLoggedIn">
         <v-list-item-icon>
            <v-btn fab x-small color="orange" dark>
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
            v-for="link of links"
            :key="link.label"
            link
            @click="toRoute({ name: link.route })"
         >
            <v-list-item-icon>
               <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
               {{ link.label }}
            </v-list-item-content>
         </v-list-item>
      </v-list>
   </v-navigation-drawer>
</template>

<script>
export default {
   name: 'NavDrawer',
   props: {
      links: Array,
   },
   methods: {
      toRoute(endpoint) {
         this.navigate({ name: endpoint.name });
         this.$store.commit('drawer');
      },
   },
   computed: {
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
      username() {
         return this.$store.state.username;
      },
      drawer() {
         return this.$store.state.drawer;
      },
   },
};
</script>

<style></style>
