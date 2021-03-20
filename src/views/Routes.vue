<template>
   <div>
      routes
      <pre>{{ prettySON(game.encounters) }}</pre>
   </div>
</template>

<script>
export default {
   name: 'Routes',
   computed: {
      game() {
         return this.$store.state.game;
      },
   },
};
</script>

<style></style>
