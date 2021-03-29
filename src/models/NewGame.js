import { arrayify } from '../util/util';
export default class NewGame {
   constructor(label, version, rules) {
      this.label = label;
      this.version = version;
      this.rules = rules;
   }
   static builder() {
      this.label = undefined;
      this.version = undefined;
      this.rules = undefined;
      return this;
   }
   static withLabel(val) {
      this.label = val;
      return this;
   }
   static withVersion(val) {
      this.version = val;
      return this;
   }
   static withRules(...vals) {
      this.rules = arrayify(...vals);
      return this;
   }
   static build() {
      return new NewGame(this.label, this.version, this.rules);
   }
}
