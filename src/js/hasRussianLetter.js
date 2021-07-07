import { cyrillicReg, latinReg } from './variables';

export default function hasRussianLetter(word) {
  if (cyrillicReg.test(word) && !latinReg.test(word)) {
    return true;
  }
  return false;
}
