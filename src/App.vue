<template>
   <v-app>
      <v-app-bar elevation="1" bottom app v-if="mobile">
         <v-app-bar-nav-icon @click.stop="drawer"></v-app-bar-nav-icon>
         <v-spacer></v-spacer>
      </v-app-bar>
      <v-main>
         <div v-if="debug">{{ JSON.stringify(this.$store.state) }}</div>
         <v-container>
            <router-view></router-view>
         </v-container>
      </v-main>
   </v-app>
</template>

<script>
export default {
   name: 'App',
   data() {
      return { debug: true };
   },
   computed: {
      mobile() {
         return this.$store.state.mobile;
      },
   },
   methods: {
      drawer() {
         this.$store.commit('drawer');
      },
   },
};
</script>

<style scoped></style>
