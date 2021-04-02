import store from '../store/store';
import { prettySON } from '../util/util';
import * as gameController from './game';
import * as userController from './user';

export const setEarnedBadge = async gym => {
   store.commit('earnedBadge', gym);
   const gymBadgeUrls = gameController.getGymBadgeIconsUrls(store.state.game);
   const snapshot = gameController.getSnapshot(store.state.game);
   snapshot.gym_badge_icon_urls = gymBadgeUrls;
   store.commit('updateGameSnapshot', snapshot);
   await userController.updateUserGames();
   await gameController.updateGymsInDB();
};
