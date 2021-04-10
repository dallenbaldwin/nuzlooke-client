import PartyState from '../constants/PartyState';
import Icons from '../constants/Icons';
import Pages from '../constants/Pages';
import TabMap from '../constants/TabMap';
import EncounterResultConst from '../constants/EncounterResultConst';
import * as util from '../util/util';
import DamageClass from '../constants/DamageClass';

export default {
   data() {
      return {
         PartyState: PartyState,
         Icons: Icons,
         Pages: Pages,
         TabMap: TabMap,
         EncounterResultConst: EncounterResultConst,
         DamageClass: DamageClass,
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
      toTitleCase: util.toTitleCase,
   },
};
