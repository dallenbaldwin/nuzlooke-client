export default class DialogCardBtn {
   constructor(text, icon) {
      this.text = text;
      this.icon = icon;
      this.action = action;
   }
   static builder() {
      this.text = undefined;
      this.icon = undefined;
      this.action = undefined;
      return this;
   }
   static withText(val) {
      this.text = val;
      return this;
   }
   static withIcon(val) {
      this.icon = val;
      return this;
   }
   static withAction(val) {
      this.action = val;
      return this;
   }
   static build() {
      return new DialogCardBtn(this.text, this.icon, this.action);
   }
}
