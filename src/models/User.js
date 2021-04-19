export default class User {
   constructor(email, password, username) {
      this.email = email;
      this.password = password;
      this.username = username;
   }
   static builder() {
      this.email = undefined;
      this.password = undefined;
      this.username = undefined;
      return this;
   }
   static withEmail(val) {
      this.email = val;
      return this;
   }
   static withPassword(val) {
      this.password = val;
      return this;
   }
   static withUsername(val) {
      this.username = val;
      return this;
   }
   static build() {
      return new User(this.email, this.password, this.username);
   }
}
