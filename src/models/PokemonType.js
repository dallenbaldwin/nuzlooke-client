export default class PokemonType {
   constructor(color, label, icon) {
      this.color = color;
      this.label = label;
      this.icon = icon;
   }
   static builder() {
      this.color = undefined;
      this.label = undefined;
      this.icon = undefined;
      return this;
   }
   static withColor(val) {
      this.color = val;
      return this;
   }
   static withLabel(val) {
      this.label = val;
      return this;
   }
   static withIcon(val) {
      this.icon = val;
      return this;
   }
   static build() {
      return new PokemonType(this.color, this.label, this.icon);
   }
}
