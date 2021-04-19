const googleAuth = (() => {
   const installClient = () => {
      const apiUrl = 'https://apis.google.com/js/api.js';
      return new Promise(resolve => {
         const script = document.createElement('script');
         script.src = apiUrl;
         script.onreadystatechange = script.onload = () => {
            if (!script.readyState || /loaded|complete/.test(script.readyState)) {
               setTimeout(() => resolve(), 500);
            }
         };
         document.getElementsByTagName('head')[0].appendChild(script);
      });
   };

   const initClient = config => {
      return new Promise(resolve => {
         window.gapi.load('auth2', () => {
            window.gapi.auth2.init(config).then(() => {
               resolve(window.gapi);
            });
         });
      });
   };

   class Auth {
      constructor() {
         this.GoogleAuth = null;
         this.isAuthorized = false;
         this.isInit = false;
         this.prompt = null;
      }
      isLoaded() {
         console.warn('isLoaded() will be deprecated. You can use "this.$gAuth.isInit"');
         return !!this.GoogleAuth;
      }
      load(config, prompt) {
         installClient()
            .then(() => {
               return initClient(config);
            })
            .then(gapi => {
               this.GoogleAuth = gapi.auth2.getAuthInstance();
               this.isInit = true;
               this.prompt = prompt;
               this.isAuthorized = this.GoogleAuth.isSignedIn.get();
            });
      }
      signIn(success, error) {
         return new Promise((resolve, reject) => {
            if (!this.GoogleAuth) {
               if (typeof error === 'function') error(false);
               reject(false);
               return;
            }
            this.GoogleAuth.signIn()
               .then(googleUser => {
                  if (typeof success === 'function') success(googleUser);
                  this.isAuthorized = this.GoogleAuth.isSignedIn.get();
                  resolve(googleUser);
               })
               .catch(err => {
                  if (typeof error === 'function') error(err);
                  reject(err);
               });
         });
      }
      getAuthCode(success, error) {
         return new Promise((resolve, reject) => {
            if (!this.GoogleAuth) {
               if (typeof error === 'function') error(false);
               reject(false);
               return;
            }
            this.GoogleAuth.grantOfflineAccess({ prompt: this.prompt })
               .then(res => {
                  if (typeof success === 'function') success(res.code);
                  resolve(res.code);
               })
               .catch(err => {
                  if (typeof error === 'function') error(err);
                  reject(err);
               });
         });
      }
      signOut(success, error) {
         return new Promise((resolve, reject) => {
            if (!this.GoogleAuth) {
               if (typeof error === 'function') error(false);
               reject(false);
               return;
            }
            this.GoogleAuth.signOut()
               .then(() => {
                  if (typeof success === 'function') success();
                  this.isAuthorized = false;
                  resolve(true);
               })
               .catch(err => {
                  if (typeof error === 'function') error(err);
                  reject(err);
               });
         });
      }
   }

   return new Auth();
})();

const installGoogleAuthPlugin = (Vue, options) => {
   // set config
   let GoogleAuthConfig = null;
   let GoogleAuthDefaultConfig = { scope: 'profile email' };
   let prompt = 'select_account';
   if (typeof options === 'object') {
      GoogleAuthConfig = Object.assign(GoogleAuthDefaultConfig, options);
      if (options.scope) GoogleAuthConfig.scope = options.scope;
      if (options.prompt) prompt = options.prompt;
      if (!options.clientId) {
         console.warn('clientId is required');
      }
   } else {
      console.warn('invalid option type. Object type accepted only');
   }

   // install vue plugin
   Vue.gAuth = googleAuth;
   Object.defineProperties(Vue.prototype, {
      $gAuth: {
         get: () => Vue.gAuth,
      },
   });
   Vue.gAuth.load(GoogleAuthConfig, prompt);
};

export default installGoogleAuthPlugin;

// https://github.com/Jebasuthan/Vue-Facebook-Google-oAuth/blob/master/src/config/google_oAuth.js
