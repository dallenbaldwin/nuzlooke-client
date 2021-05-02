<template>
   <v-img
      contain
      :alt="altText"
      :src="image"
      aspect-ratio="3/2"
      :max-width="maxWidth"
      :lazy-src="Icons.MISC.NUZLOOKE"
      position="center left"
   ></v-img>
</template>

<script>
export default {
   name: 'ResourceImage',
   props: {
      'alt-text': { required: true },
      image: { required: true },
      'max-width': { required: true },
   },
   data() {
      return {};
   },
   computed: {},
   methods: {},
   mounted() {
      this.$forceUpdate();
   },
};
</script>

<style></style>
