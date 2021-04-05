export default class GameVersion {
   constructor(
      label,
      generation,
      generation_label,
      version,
      version_group,
      regions,
      icon
   ) {
      this.label = label;
      this.generation = generation;
      this.generation_label = generation_label;
      this.version = version;
      this.version_group = version_group;
      this.regions = regions;
      this.icon = icon;
   }
   static builder() {
      this.label = undefined;
      this.generation = undefined;
      this.generation_label = undefined;
      this.version = undefined;
      this.version_group = undefined;
      this.regions = undefined;
      this.icon = undefined;
      return this;
   }
   static withLabel(val) {
      this.label = val;
      return this;
   }
   static withGeneration(val) {
      this.generation = val;
      return this;
   }
   static withGenerationLabel(val) {
      this.generation_label = val;
      return this;
   }
   static withVersion(val) {
      this.version = val;
      return this;
   }
   static withVersionGroup(val) {
      this.version_group = val;
      return this;
   }
   static withRegions(...vals) {
      this.regions = Array.from([...vals]).flatMap(x => x);
      return this;
   }
   static withIcon(val) {
      this.icon = val;
      return this;
   }
   static build() {
      return new GameVersion(
         this.label,
         this.generation,
         this.generation_label,
         this.version,
         this.version_group,
         this.regions,
         this.icon
      );
   }
}
