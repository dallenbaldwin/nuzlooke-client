export default class DialogCardFormElement {
   constructor(label, type, options) {
      this.label = label;
      this.type = type;
      this.options = options;
   }
   static builder() {
      this.label = undefined;
      this.type = undefined;
      this.options = undefined;
      return this;
   }
   static withLabel(val) {
      this.label = val;
      return this;
   }
   static withType(val) {
      this.type = val;
      return this;
   }
   static withOptions(val) {
      this.options = val;
      return this;
   }
   static build() {
      return new DialogCardFormElement(this.label, this.type, this.options);
   }
}
