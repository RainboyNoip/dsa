//得到源码
import api from './index.js'
export function getSrc(src_url) {
    return api.get(src_url);
  }

