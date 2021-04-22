import { isMobile } from 'mobile-device-detect';
import router from '../router/router';

export const navigate = endpoint => {
   router.replace(endpoint);
};

export const arrayify = (...values) => {
   return Array.from([...values]).flatMap(x => x);
};

export const toTitleCase = str =>
   str
      .split(' ')
      .map(s => s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase())
      .join(' ');

export const deClassify = classObject => JSON.parse(JSON.stringify(classObject));

export const isUndefined = value => value === undefined || value === null || value === '';

export const isEmptyArray = array => (isUndefined(array) ? true : array.length === 0);

export const prettySON = json => JSON.stringify(json, null, 2);

export const mobile = () => isMobile;

export const errorCatch = err => prettySON([err.message, err.stack]);

export const isOrUndefined = (a, b) => {
   return isUndefined(b) || a === b;
};

export const likeOrUndefined = (a, b) => {
   if (isUndefined(a) && !isUndefined(b)) return false;
   if (!isUndefined(a)) a = a.toLowerCase();
   if (!isUndefined(b)) b = b.toLowerCase();
   return isUndefined(b) || a.includes(b) || b.includes(a);
};

export const includesOrEmptyArray = (a, b) => {
   return (
      isEmptyArray(b) ||
      b.filter(i => {
         if (a.length > 0) return a.includes(i);
         else return i === a;
      }).length > 0
   );
};
