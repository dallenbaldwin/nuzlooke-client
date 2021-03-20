<template>
   <div>
      Rules
      <pre>{{ prettySON(game.game_rules) }}</pre>
   </div>
</template>

<script>
export default {
   name: 'Rules',
   computed: {
      game() {
         return this.$store.state.game;
      },
   },
};
</script>

<style></style>
