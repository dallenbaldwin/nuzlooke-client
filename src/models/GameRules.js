import GameRule from './GameRule.js';

export default Object.freeze({
   USE_NICKNAMES: GameRule.builder()
      .withLabel('Use Nicknames')
      .withDescription(
         'Give your party members nicknames when caught. This will increase the bond you feel with them and incentivize you from letting them die so easily'
      )
      .withIsActive(true)
      .build(),
   FAINTING_KILLS: GameRule.builder()
      .withLabel('Fainted Means Dead')
      .withDescription(
         'If a party member faints for any reason, it is considered dead. It cannot be used for any purpose and should be released.'
      )
      .withIsActive(true)
      .build(),
   ONE_MON_ONE_AREA: GameRule.builder()
      .withLabel('One Pokemon Per Area')
      .withDescription(
         'You may only catch one Pokemon per new area you enter. It must be the first Pokemon you encounter in that area.'
      )
      .withIsActive(true)
      .build(),
   USE_LEVEL_CAPS: GameRule.builder()
      .withLabel('Use Level Caps')
      .withIsActive(true)
      .build(),
   BLIND_RUN: GameRule.builder()
      .withLabel('Blind Run')
      .withIsActive(true)
      .build(),
   INSTA_DEATH: GameRule.builder()
      .withLabel('Insta-Death')
      .withIsActive(true)
      .build(),
   DEATH_MARCH: GameRule.builder()
      .withLabel('Death March')
      .withIsActive(true)
      .build(),
});
