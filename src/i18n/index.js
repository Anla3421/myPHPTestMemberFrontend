import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {locale as zh} from './langs/tw'
import {locale as en} from './langs/en'
import {locale as cn} from './langs/cn'
import {locale as jp} from './langs/jp'

Vue.use(VueI18n);

let messages = {}
messages = { ...messages, en, zh, cn, jp }

const i18n = new VueI18n({
    locale: localStorage.getItem('language') || 'zh',
    // fallbackLocale: defaultLocale,
    messages
});

export default i18n;