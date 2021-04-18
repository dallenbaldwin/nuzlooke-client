<template>
   <div>
      <v-fade-transition group>
         <c-error
            v-for="(error, i) of errors.errors"
            :key="i"
            :error="error"
            :max-width="mobile() ? null : 262"
            class="ma-3"
         ></c-error>
      </v-fade-transition>
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
   </div>
</template>

<script>
import Button from '../Button.vue';
import Errors from '../Errors.vue';
import Checkbox from '../form-controls/Checkbox.vue';
import TextField from '../form-controls/TextField.vue';
import * as util from '../../util/util';
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
      'c-error': Errors,
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
         errors: {
            errors: [],
         },
      };
   },
   methods: {
      async authenticate() {
         this.values.isRegister = this.isRegister;
         this.errors = authController.getValidationErrors(this.values);
         if (this.errors.hasErrors) return;
         const auth = await authController.authenticate(this.values);
         if (!util.isUndefined(auth)) {
            this.errors.errors.push(auth.error);
         }
      },
      async register() {
         this.values.isRegister = this.isRegister;
         this.errors = authController.getValidationErrors(this.values);
         if (this.errors.hasErrors) return;
         const register = await authController.register(this.values);
         if (!util.isUndefined(register)) {
            this.errors.errors.push(register.error);
         }
      },
      forgotPassword() {
         alert('well that sucks!');
      },
   },
};
</script>

<style></style>
