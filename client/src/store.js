import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alertMessage: null
  },
  mutations: {
    setAlertMessage(state, mes) {
      state.alertMessage = mes
    }
  },
  getters: {
    alertMessage: state => state.alertMessage
  },
  actions: {
    setAlertMessageForTime(store, mes) {
      store.commit('setAlertMessage', mes)
      setTimeout(() => {
        store.commit('setAlertMessage', null)
      }, 3000)
    }
  }
})
