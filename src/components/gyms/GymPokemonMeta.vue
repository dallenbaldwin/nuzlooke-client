<template>
   <v-chip
      label
      outlined
      :color="outline"
      :text-color="'text-color'"
      small
      class="mr-1"
      @mouseenter="showHint = true"
      @mouseleave="showHint = false"
      :ripple="false"
   >
      {{ label }}: {{ text }}
      <v-slide-x-transition>
         <v-icon v-show="showHint && false" @click="getMetaData">{{
            Icons.CONTROLS.HELP
         }}</v-icon>
      </v-slide-x-transition>
   </v-chip>
</template>

<script>
export default {
   name: 'GymPokemonMeta',
   props: {
      text: { required: true },
      label: { required: true },
      outline: { required: false, default: 'black' },
      'text-color': { required: false, default: 'black' },
   },
   computed: {},
   data() {
      return {
         showHint: false,
      };
   },
   methods: {
      getMetaData() {
         if (this.showHint) alert(this.text);
         // a lot of the grunt work has been done for this to work
      },
   },
};
</script>

<style scoped>
.v-chip {
   padding: 0 6px;
}
</style>
