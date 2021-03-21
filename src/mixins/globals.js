import Versions from '../constants/Versions.js';
import PartyState from '../constants/PartyState.js';
import Icons from '../constants/Icons.js';
import Pages from '../constants/Pages.js';
import TabMap from '../constants/TabMap.js';
import EncounterResult from '../constants/EncounterResult.js';
import * as util from '../util/util.js';

export default {
   data() {
      return {
         Versions: Versions,
         PartyState: PartyState,
         Icons: Icons,
         Pages: Pages,
         TabMap: TabMap,
         EncounterResult: EncounterResult,
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
      toAPIResponse: util.isUndefined,
      prettySON: util.prettySON,
   },
};
