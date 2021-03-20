<template>
   <div>
      <v-card-title>{{ encounter.label }}</v-card-title>
      <v-card-subtitle>Available Pokemon</v-card-subtitle>
      <v-card-text class="d-flex justify-end">
         <c-poke-sprite
            class="mx-2"
            v-for="pokemon of encounter.pokemons"
            :key="pokemon.species"
            :src="
               pokemon.sprite_url ||
                  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/25.png'
            "
            outlineColor=""
            size="small"
         ></c-poke-sprite>
      </v-card-text>
      <v-card-actions>
         <v-spacer></v-spacer>
         <!-- TODO: make this into a component?? -->
         <v-btn text @click="emitNewEncounter">
            <v-icon color="green" dark>{{ Icons.CONTROLS.EXCLAIM }}</v-icon>
            New Encounter
         </v-btn>
      </v-card-actions>
   </div>
</template>

<script>
import PokeSprite from './PokeSprite.vue';

export default {
   name: 'AvailableRoute',
   props: ['encounter'],
   components: {
      'c-poke-sprite': PokeSprite,
   },
   methods: {
      emitNewEncounter() {
         this.$emit('new-encounter', this.encounter);
      },
   },
};
</script>

<style></style>
