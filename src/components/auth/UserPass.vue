<template>
   <div>
      <c-text-field label="Email" v-model="values.email"></c-text-field>
      <c-text-field
         label="Password"
         v-model="values.password"
         :password="true"
      ></c-text-field>
      <c-text-field
         v-if="isRegister"
         label="Confirm Password"
         v-model="values.confirmPassword"
         :password="true"
      ></c-text-field>
      <div class="d-flex flex-column align-end">
         <!-- turn of remember me and forgot password for now -->
         <c-checkbox
            v-if="!isRegister && false"
            label="Remember me"
            v-model="values.remember"
         ></c-checkbox>
         <a
            v-if="!isRegister && false"
            class="ma-3 text-decoration-none"
            @click="forgotPassword"
            >Forgot your password?</a
         >
         <div>
            <c-btn
               @click="isRegister ? register() : authenticate()"
               :icon="Icons.CONTROLS.CONFIRM"
            >
               {{ isRegister ? 'Register' : 'Sign in' }}
            </c-btn>
         </div>
      </div>
      <c-errors v-if="hasErrors" :errors="errors"></c-errors>
   </div>
</template>

<script>
import Button from '../Button.vue';
import Errors from '../Errors.vue';
import Checkbox from '../form-controls/Checkbox.vue';
import TextField from '../form-controls/TextField.vue';
import * as authController from '../../controllers/auth';

export default {
   name: 'UserPass',
   props: {
      isRegister: { required: false, default: false },
   },
   components: {
      'c-text-field': TextField,
      'c-btn': Button,
      'c-checkbox': Checkbox,
      'c-errors': Errors,
   },
   computed: {},
   data() {
      return {
         values: {
            email: null,
            password: null,
            confirmPassword: null,
            remember: false,
         },
         errors: null,
         hasErrors: false,
      };
   },
   methods: {
      async authenticate() {
         let errors = authController.getValidationErrors(this.values);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         errors = await authController.authenticate(this.values);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
         }
      },
      async register() {
         let errors = authController.getValidationErrors(this.values);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
            return;
         }
         errors = await authController.register(this.values);
         if (errors) {
            this.errors = errors;
            this.hasErrors = true;
         }
      },
      forgotPassword() {
         alert('well that sucks!');
      },
   },
   mounted() {
      this.values.isRegister = this.isRegister;
   },
};
</script>

<style></style>
