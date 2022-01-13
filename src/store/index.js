import Vue from 'vue'
import Vuex from 'vuex'
import i18n from '../i18n'

Vue.use(i18n)
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        searchstatus: [
            { text: i18n.t('cont.off'), value: "0" },
            { text: i18n.t('cont.on'), value: "1" },
            { text: i18n.t('cont.all'), value: "" },
        ],
        per: [
            { text: "10", value: 10 },
            { text: "25", value: 25 },
            { text: "50", value: 50 },
            { text: "100", value: 100 },
        ],
    },
    mutations: {
    },
    actions: {
    },
    modules: {
    }
})
