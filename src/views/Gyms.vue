<template>
   <v-row>
      <v-expansion-panels popout>
         <c-gymcordian v-for="gym of gyms" :key="gym.sort_id" :gym="gym"></c-gymcordian>
      </v-expansion-panels>
      <v-dialog v-model="filter.flag" width="500">
         <c-dialog-card
            :props="filter.dialogCard"
            v-on:close-dialog="closeDialog"
         ></c-dialog-card>
      </v-dialog>
   </v-row>
</template>

<script>
import Gymcordian from '../components/gyms/Gymcordian.vue';
import DialogCard from '../components/DialogCard.vue';

export default {
   name: 'Gyms',
   components: {
      'c-dialog-card': DialogCard,
      'c-gymcordian': Gymcordian,
   },
   data() {
      return {
         filter: {
            flag: false,
            dialogCard: {
               title: 'Filter Gyms',
               text: 'I want to filter Gyms!',
               cancelBtn: { text: 'close' },
            },
         },
      };
   },
   computed: {
      gyms() {
         return this.$store.state.game.gyms;
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
