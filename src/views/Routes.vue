<template>
   <v-row class="d-flex justify-center align-content-start flex-row">
      <c-route-card
         v-for="(encounter, i) of game.encounters"
         :key="i"
         :encounter="encounter"
      ></c-route-card>
   </v-row>
</template>

<script>
import RouteCard from '../components/routes/RouteCard.vue';

export default {
   name: 'Routes',
   components: {
      'c-route-card': RouteCard,
   },
   data() {
      return {};
   },

   computed: {
      game() {
         return this.$store.state.game;
      },
      userId() {
         return this.$store.state.userId;
      },
   },
   methods: {
      // filterRoutes() {
      //    alert('i want to filter my routes!');
      // },
   },
};
</script>

<style></style>
