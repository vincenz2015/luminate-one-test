import inject from 'injectinto';

const store = {
    name: 'timefilter',
    namespaced: true,
    state: {
       days: -1
    },
    mutations: {
        updateDays: (state, payload) => {
            state.days = payload;
        }
    }
}

inject('store', store);
inject('pod', ({hub, store}) => {
    hub.on('update days', payload => {
        store.commit('timefilter/updateDays', payload)
    });
});