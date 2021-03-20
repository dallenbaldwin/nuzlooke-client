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
};
</script>

<style></style>
