import GameVersion from '../models/GameVersion.js';
import Version from './pokeapi/Version.js';
import APIGeneration from './pokeapi/Generation.js';
import Region from './pokeapi/Region.js';
import VersionGroup from './pokeapi/VersionGroup.js';
import Icons from './Icons.js';
import Generation from './Generation.js';

export default Object.freeze({
   EMERALD: GameVersion.builder()
      .withGeneration(APIGeneration.GEN3)
      .withLabel('Emerald')
      .withGenerationLabel(Generation.GEN3)
      .withRegions(Region.HOENN)
      .withVersion(Version.EMERALD)
      .withVersionGroup(VersionGroup.EMERALD)
      .withIcon(Icons.CONSOLES.GBA)
      .build(),
   RUBY: GameVersion.builder()
      .withGeneration(APIGeneration.GEN3)
      .withLabel('Ruby')
      .withGenerationLabel(Generation.GEN3)
      .withRegions(Region.HOENN)
      .withVersion(Version.RUBY)
      .withVersionGroup(VersionGroup.RUBYSAPPHIRE)
      .withIcon(Icons.CONSOLES.GBA)
      .build(),
   SAPPHIRE: GameVersion.builder()
      .withGeneration(APIGeneration.GEN3)
      .withLabel('Sapphire')
      .withGenerationLabel(Generation.GEN3)
      .withRegions(Region.HOENN)
      .withVersion(Version.SAPPHIRE)
      .withVersionGroup(VersionGroup.RUBYSAPPHIRE)
      .withIcon(Icons.CONSOLES.GBA)
      .build(),
   FIRERED: GameVersion.builder()
      .withGeneration(APIGeneration.GEN3)
      .withLabel('FireRed')
      .withRegions(Region.KANTO)
      .withGenerationLabel(Generation.GEN3)
      .withVersion(Version.FIRERED)
      .withVersionGroup(VersionGroup.FIREREDLEAFGREEN)
      .withIcon(Icons.CONSOLES.GBA)
      .build(),
   LEAFGREEN: GameVersion.builder()
      .withGeneration(APIGeneration.GEN3)
      .withLabel('LeafGreen')
      .withRegions(Region.KANTO)
      .withGenerationLabel(Generation.GEN3)
      .withVersion(Version.LEAFGREEN)
      .withVersionGroup(VersionGroup.FIREREDLEAFGREEN)
      .withIcon(Icons.CONSOLES.GBA)
      .build(),
   LETSGOEEVEE: GameVersion.builder()
      .withGeneration(APIGeneration.GEN7)
      .withLabel(`Let's Go Eevee`)
      .withRegions(Region.KANTO)
      .withGenerationLabel(Generation.GEN7)
      .withVersion(Version.LETSGOEEVEE)
      .withVersionGroup(VersionGroup.LETSGO)
      .withIcon(Icons.CONSOLES.SWITCH)
      .build(),
   LETSGOPIKACHU: GameVersion.builder()
      .withGeneration(APIGeneration.GEN7)
      .withLabel(`Let's Go Pikachu`)
      .withGenerationLabel(Generation.GEN7)
      .withRegions(Region.KANTO)
      .withVersion(Version.LETSGOPIKACHU)
      .withVersionGroup(VersionGroup.LETSGO)
      .withIcon(Icons.CONSOLES.SWITCH)
      .build(),
});
