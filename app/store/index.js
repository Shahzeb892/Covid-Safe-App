import { createStore } from 'vuex'

export default createStore({
  state: {
    hasLogin:false,
    serviceTab:0,
    useName:"",
  },
  getters: {
  },
  mutations: {
    setLogin(state,newValue){
      state.hasLogin = newValue
    }
    
  },
  actions: {
  },
  modules: {
  }
})
