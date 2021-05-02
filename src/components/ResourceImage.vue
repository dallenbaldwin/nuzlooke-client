<template>
   <v-img
      contain
      :alt="altText"
      :src="computedImg"
      aspect-ratio="3/2"
      :max-width="maxWidth"
      :lazy-src="Icons.MISC.NUZLOOKE"
      position="center left"
      @error="handleError"
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
   computed: {
      computedImg() {
         return this.image;
      },
   },
   methods: {
      handleError(err) {
         console.log(err);
      },
   },
};
</script>

<style></style>
