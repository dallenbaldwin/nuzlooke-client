<template>
   <v-card
      @click="$emit('click', $event)"
      min-width="262"
      class="ma-3"
      outlined
      elevation="1"
   >
      <v-card-text class="d-flex flex-row align-center">
         <slot></slot>
         <span class="mx-6 text-h5">{{ label }}</span>
      </v-card-text>
   </v-card>
</template>

<script>
export default {
   name: 'LoginProvider',
   props: {
      label: { required: true },
   },
};
</script>

<style></style>
