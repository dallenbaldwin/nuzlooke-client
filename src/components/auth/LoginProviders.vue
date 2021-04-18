<template>
   <div>
      <v-card
         @click="authenticate(provider.label)"
         v-for="(provider, i) of providers"
         :key="i"
         min-width="300"
         class="ma-3"
         outlined
         elevation="1"
      >
         <v-card-text class="d-flex flex-row align-center">
            <v-icon :color="provider.color">{{ provider.icon }}</v-icon>
            <v-spacer></v-spacer>
            <span class="text-button font-weight-bold">
               {{ provider.label }}
            </span>
         </v-card-text>
      </v-card>
   </div>
</template>

<script>
import Icons from '../../constants/Icons';
import colors from 'vuetify/lib/util/colors';

export default {
   name: 'LoginProviders',
   data() {
      return {
         providers: [
            { label: 'Google', icon: Icons.BRANDS.GOOGLE, color: colors.red.accent4 },
            {
               label: 'Facebook',
               icon: Icons.BRANDS.FACEBOOK,
               color: colors.blue.darken3,
            },
            { label: 'Apple', icon: Icons.BRANDS.APPLE, color: colors.grey.darken2 },
         ],
      };
   },
   methods: {
      authenticate(provider) {
         alert(`authenticate with ${provider}`);
      },
   },
};
</script>

<style></style>
