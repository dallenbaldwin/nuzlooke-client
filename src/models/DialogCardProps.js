import Util from '../mixins/util.js';

export default class DialogCardProps {
   constructor(title, text, btn, formElements) {
      this.title = title;
      this.text = text;
      this.btn = btn;
      this.formElements = formElements;
   }
   static builder() {
      this.title = undefined;
      this.text = undefined;
      this.btn = undefined;
      this.formElements = undefined;
      return this;
   }
   static withTitle(val) {
      this.title = val;
      return this;
   }
   static withText(val) {
      this.text = val;
      return this;
   }
   static withBtn(val) {
      this.btn = val;
      return this;
   }
   static withFormElements(...vals) {
      this.formElements = Util.default.methods.arrayify(...vals);
      return this;
   }
   static build() {
      return new DialogCardProps(this.title, this.text, this.btn, this.formElements);
   }
}
