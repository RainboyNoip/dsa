import api from '../index.js'
export default {
  getHelp () {
    return api.get('help');
  }
}
