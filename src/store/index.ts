import Vue from 'vue';
import Vuex from 'vuex';

import { createVuexStore } from 'vuex-simple';

import Store from './store';

Vue.use(Vuex);

const instance = new Store();

export default createVuexStore(instance, {
    strict: false,
    modules: {},
    plugins: []
});

// instance is now bound to the store: we can now call our mutations, getters and such as we would normally with our class instance
// instance.bar.foo2.increment();