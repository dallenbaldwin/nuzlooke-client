<template>
   <div>
      <v-card
         @click="provider.handler"
         v-for="(provider, i) of providers"
         :key="i"
         min-width="262"
         class="ma-3"
         outlined
         elevation="1"
      >
         <v-card-text class="d-flex flex-row align-center">
            <v-icon x-large :color="provider.color">{{ provider.icon }}</v-icon>
            <span class="mx-6 text-h5">
               {{ provider.label }}
            </span>
         </v-card-text>
      </v-card>
   </div>
</template>

<script>
import Icons from '../../constants/Icons';

export default {
   name: 'LoginProviders',
   data() {
      return {
         providers: [
            {
               label: 'Google',
               icon: Icons.BRANDS.GOOGLE,
               color: '#DB4437',
               handler: this.withGoogle,
            },
            {
               label: 'Facebook',
               icon: Icons.BRANDS.FACEBOOK,
               color: '#1778F2',
               handler: this.withFacebook,
            },
            {
               label: 'Apple',
               icon: Icons.BRANDS.APPLE,
               color: '#555555',
               handler: this.withApple,
            },
         ],
      };
   },
   methods: {
      withGoogle() {
         alert('google!');
      },
      withFacebook() {
         alert('facebook!');
      },
      withApple() {
         alert('apple!');
      },
   },
};
</script>

<style></style>
