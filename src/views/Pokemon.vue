<template>
   <div>
      pokemon
      <pre>{{ prettySON(game.pokemons) }}</pre>
   </div>
</template>

<script>
export default {
   name: 'Pokemon',
   computed: {
      game() {
         return this.$store.state.game;
      },
   },
   methods: {
      // filterPokemon() {
      //    alert('i want to filter my pokemon!');
      // },
   },
};
</script>

<style></style>
