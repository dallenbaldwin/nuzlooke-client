<template>
   <v-row class="d-flex justify-center align-content-start flex-row">
      <c-route-card
         v-for="(encounter, i) of game.encounters"
         :key="i"
         :encounter="encounter"
      ></c-route-card>
      <v-dialog v-model="filter.flag" width="500">
         <c-dialog-card
            :props="filter.dialogCard"
            v-on:close-dialog="closeDialog"
         ></c-dialog-card>
      </v-dialog>
   </v-row>
</template>

<script>
import DialogCard from '../components/DialogCard.vue';
import RouteCard from '../components/routes/RouteCard.vue';

export default {
   name: 'Routes',
   components: {
      'c-route-card': RouteCard,
      'c-dialog-card': DialogCard,
   },
   data() {
      return {
         // TODO filters
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Routes',
               text: 'I want to filter Routes!',
               cancelBtn: { text: 'close' },
            },
         },
      };
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
      openFilter() {
         this.filter.flag = true;
      },
      closeDialog() {
         this.filter.flag = false;
      },
   },
};
</script>

<style></style>
