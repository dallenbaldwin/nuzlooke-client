import Versions from '../constants/Versions';
import PartyState from '../constants/PartyState';
import Icons from '../constants/Icons';
import Pages from '../constants/Pages';
import TabMap from '../constants/TabMap';
import EncounterResultConst from '../constants/EncounterResultConst';
import * as util from '../util/util';
import PokemonType from '../constants/PokemonType';
import DamageClass from '../constants/DamageClass';
import GymPokemonMeta from '../constants/GymPokemonMeta';

export default {
   data() {
      return {
         Versions: Versions,
         PartyState: PartyState,
         Icons: Icons,
         Pages: Pages,
         TabMap: TabMap,
         EncounterResultConst: EncounterResultConst,
         PokemonType: PokemonType,
         DamageClass: DamageClass,
         GymPokemonMeta: GymPokemonMeta,
      };
   },
   methods: {
      navigate: util.navigate,
      logout: util.logout,
      login: util.login,
      exitGame: util.exitGame,
      mobile: util.mobile,
      arrayify: util.arrayify,
      deClassify: util.deClassify,
      isUndefined: util.isUndefined,
      isEmptyArray: util.isEmptyArray,
      prettySON: util.prettySON,
   },
};
