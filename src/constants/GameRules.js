import GameRule from '../models/GameRule.js';

export default Object.freeze({
   USE_NICKNAMES: GameRule.builder()
      .withId(1000)
      .withLabel('Use Nicknames')
      .withDescription(
         'Give your party members nicknames when caught. This will increase the bond you feel with them and incentivize you from letting them die so easily'
      )
      .build(),
   FAINTING_KILLS: GameRule.builder()
      .withId(1001)
      .withLabel('Fainted Means Dead')
      .withDescription(
         'If a party member faints for any reason, it is considered dead. It cannot be used for any purpose and should be released.'
      )
      .build(),
   ONE_MON_ONE_AREA: GameRule.builder()
      .withId(1002)
      .withLabel('One Pokemon Per Area')
      .withDescription(
         'You may only catch one Pokemon per new area you enter. It must be the first Pokemon you encounter in that area.'
      )
      .build(),
   USE_LEVEL_CAPS: GameRule.builder()
      .withId(1003)
      .withLabel('Use Level Caps')
      .withDescription(
         `You may not over-level your Pokemon higher than the highest level Pokemon of the next Gym Leader.`
      )
      .build(),
   BLIND_RUN: GameRule.builder()
      .withId(1004)
      .withLabel('Blind Run')
      .withDescription(
         `You may not use any guides, digital or otherwise, as you play through this run.`
      )
      .build(),
   INSTA_DEATH: GameRule.builder()
      .withId(1005)
      .withLabel('Insta-Death')
      .withDescription(
         `If your entire Party faints during the course of any wild encounter, trainer battle, or Gym battle; the game is over.`
      )
      .build(),
   DEATH_MARCH: GameRule.builder()
      .withId(1006)
      .withDescription(
         `If your entire Party faints during the course of any wild encounter, trainer battle, or Gym battle; you may replace fainted Party Pokemon with PC Pokemon. You can do this as long as you have Pokemon in the PC.`
      )
      .withLabel('Death March')
      .build(),
});
