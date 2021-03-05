<template>
   <v-speed-dial open-on-hover top right direction="bottom" transition="scale-transition">
      <template v-slot:activator>
         <v-btn dark fab><v-icon>mdi-menu</v-icon></v-btn>
      </template>
      <v-btn
         fab
         small
         v-for="link of links.filter(
            l => l.loginAccess === isLoggedIn && l.route !== currentRoute
         )"
         :key="link"
         :dark="link.dark"
         @click="navigate(link.route)"
      >
         <v-tooltip>{{ link.label }}</v-tooltip>
         <v-icon>{{ link.icon }}</v-icon>
      </v-btn>
   </v-speed-dial>
</template>

<script>
export default {
   name: 'SpeedDial',
   data() {
      return {
         currentRoute: null,
      };
   },
   props: {
      links: Array,
   },
   methods: {
      navigate(endpoint) {
         this.$router.replace({ name: endpoint });
      },
   },
   computed: {
      isLoggedIn() {
         return this.$store.state.isLoggedIn;
      },
   },
   beforeUpdate() {
      this.currentRoute = this.$route.name;
   },
};
</script>

<style scoped>
.v-speed-dial {
   position: absolute;
}

.v-btn--floating {
   position: relative;
}
</style>
