<template>
   <v-chip outlined :color="DamageClass[upperClass].color" small class="mr-1">
      {{ damageClass }}
   </v-chip>
</template>

<script>
export default {
   name: 'DamageClass',
   props: ['damageClass'],
   computed: {
      upperClass() {
         return this.damageClass.toUpperCase();
      },
   },
   data() {
      return {};
   },
};
</script>

<style>
.v-chip {
   padding: 0 6px;
}
</style>
