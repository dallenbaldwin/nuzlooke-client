import PokemonType from '../models/PokemonType';

export default Object.freeze({
   NORMAL: PokemonType.builder()
      .withColor('#9099a1')
      .withLabel('Normal')
      .withIcon('https://cdn.bulbagarden.net/upload/9/95/Normal_icon_SwSh.png')
      .build(),
   FIGHTING: PokemonType.builder()
      .withColor('#ce4069')
      .withLabel('Fighting')
      .withIcon('https://cdn.bulbagarden.net/upload/3/3b/Fighting_icon_SwSh.png')
      .build(),
   FLYING: PokemonType.builder()
      .withColor('#8fa8dd')
      .withLabel('Flying')
      .withIcon('https://cdn.bulbagarden.net/upload/b/b5/Flying_icon_SwSh.png')
      .build(),
   POISON: PokemonType.builder()
      .withColor('#ab6ac8')
      .withLabel('Poison')
      .withIcon('https://cdn.bulbagarden.net/upload/8/8d/Poison_icon_SwSh.png')
      .build(),
   GROUND: PokemonType.builder()
      .withColor('#d97746')
      .withLabel('Ground')
      .withIcon('https://cdn.bulbagarden.net/upload/2/27/Ground_icon_SwSh.png')
      .build(),
   ROCK: PokemonType.builder()
      .withColor('#c7b78b')
      .withLabel('Rock')
      .withIcon('https://cdn.bulbagarden.net/upload/1/11/Rock_icon_SwSh.png')
      .build(),
   BUG: PokemonType.builder()
      .withColor('#90c12c')
      .withLabel('Bug')
      .withIcon('https://cdn.bulbagarden.net/upload/9/9c/Bug_icon_SwSh.png')
      .build(),
   GHOST: PokemonType.builder()
      .withColor('#5269ac')
      .withLabel('Ghost')
      .withIcon('https://cdn.bulbagarden.net/upload/0/01/Ghost_icon_SwSh.png')
      .build(),
   STEEL: PokemonType.builder()
      .withColor('#5a8ea1')
      .withLabel('Steel')
      .withIcon('https://cdn.bulbagarden.net/upload/0/09/Steel_icon_SwSh.png')
      .build(),
   FIRE: PokemonType.builder()
      .withColor('#ff9c54')
      .withLabel('Fire')
      .withIcon('https://cdn.bulbagarden.net/upload/a/ab/Fire_icon_SwSh.png')
      .build(),
   WATER: PokemonType.builder()
      .withColor('#4d90d5')
      .withLabel('Water')
      .withIcon('https://cdn.bulbagarden.net/upload/8/80/Water_icon_SwSh.png')
      .build(),
   GRASS: PokemonType.builder()
      .withColor('#63bb5b')
      .withLabel('Grass')
      .withIcon('https://cdn.bulbagarden.net/upload/a/a8/Grass_icon_SwSh.png')
      .build(),
   ELECTRIC: PokemonType.builder()
      .withColor('#f3d23b')
      .withLabel('Electric')
      .withIcon('https://cdn.bulbagarden.net/upload/7/7b/Electric_icon_SwSh.png')
      .build(),
   PSYCHIC: PokemonType.builder()
      .withColor('#f97176')
      .withLabel('Psychic')
      .withIcon('https://cdn.bulbagarden.net/upload/7/73/Psychic_icon_SwSh.png')
      .build(),
   ICE: PokemonType.builder()
      .withColor('#74cec0')
      .withLabel('Ice')
      .withIcon('https://cdn.bulbagarden.net/upload/1/15/Ice_icon_SwSh.png')
      .build(),
   DRAGON: PokemonType.builder()
      .withColor('#0a6dc4')
      .withLabel('Dragon')
      .withIcon('https://cdn.bulbagarden.net/upload/7/70/Dragon_icon_SwSh.png')
      .build(),
   DARK: PokemonType.builder()
      .withColor('#5a5366')
      .withLabel('Dark')
      .withIcon('https://cdn.bulbagarden.net/upload/d/d5/Dark_icon_SwSh.png')
      .build(),
   FAIRY: PokemonType.builder()
      .withColor('#ec8fe6')
      .withLabel('Fairy')
      .withIcon('https://cdn.bulbagarden.net/upload/c/c6/Fairy_icon_SwSh.png')
      .build(),
   '???': PokemonType.builder()
      .withColor('#68a090')
      .withLabel('???')
      .withIcon('null')
      .build(),
});
