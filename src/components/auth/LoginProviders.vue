<template>
   <div>
      <c-login-provider v-google-signin-button="googleClientId" label="Google">
         <v-img
            src="../../../public/img/google.svg"
            contain
            max-height="40"
            max-width="40"
         ></v-img>
      </c-login-provider>
      <c-login-provider v-facebook-signin-button="facebookClientId" label="Facebook">
         <v-icon x-large color="#1778F2">
            {{ Icons.BRANDS.FACEBOOK }}
         </v-icon>
      </c-login-provider>
      <c-error-messages v-if="hasErrors" :errors="errors"></c-error-messages>
   </div>
</template>

<script>
import { loginWithGoogle, loginWithFacebook } from '../../controllers/auth';
import GoogleSignInButton from 'vue-google-signin-button-directive';
import FacebookSignInButton from '../../services/FacebookSignInBtn';
import ErrorsMessagesVue from '../ErrorMessages.vue';
import LoginProviderVue from './LoginProvider.vue';

export default {
   name: 'LoginProviders',
   components: {
      'c-error-messages': ErrorsMessagesVue,
      'c-login-provider': LoginProviderVue,
   },
   directives: {
      GoogleSignInButton,
      FacebookSignInButton,
   },
   data() {
      return {
         googleClientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
         facebookClientId: process.env.VUE_APP_FACEBOOK_CLIENT_ID,
         errors: null,
         hasErrors: false,
      };
   },
   methods: {
      async OnGoogleAuthSuccess(idToken) {
         let errors = await loginWithGoogle(idToken);
         if (errors) {
            this.hasErrors = true;
            this.errors = errors;
         }
      },
      OnGoogleAuthFail(err) {
         if (err.error === 'popup_closed_by_user') return;
         this.hasErrors = true;
         this.errors = { errors: [err.error] };
      },
      async OnFacebookAuthSuccess(idToken) {
         let errors = await loginWithFacebook(idToken);
         if (errors) {
            this.hasErrors = true;
            this.errors = errors;
         }
      },
      OnFacebookAuthFail(err) {
         this.hasErrors = true;
         this.errors = { errors: [err] };
      },
   },
};
// https://developers.google.com/identity/branding-guidelines
</script>

<style></style>
