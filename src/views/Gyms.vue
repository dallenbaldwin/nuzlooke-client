<template>
   <div>
      gyms
      <pre>{{ prettySON(game.gyms) }}</pre>
   </div>
</template>

<script>
export default {
   name: 'Gyms',
   computed: {
      game() {
         return this.$store.state.game;
      },
   },
   methods: {
      // filterGyms() {
      //    alert('i want to filter my gyms!');
      // },
   },
};
</script>

<style></style>
