<template>
   <v-row>
      <v-expansion-panels popout>
         <c-gymcordian v-for="gym of gyms" :key="gym.sort_id" :gym="gym"></c-gymcordian>
      </v-expansion-panels>
   </v-row>
</template>

<script>
import Gymcordian from '../components/gyms/Gymcordian';

export default {
   name: 'Gyms',
   components: {
      'c-gymcordian': Gymcordian,
   },
   computed: {
      gyms() {
         return this.$store.state.game.gyms;
      },
   },
   methods: {
      filterGyms() {
         alert('i want to filter my gyms!');
      },
   },
};
</script>

<style></style>
