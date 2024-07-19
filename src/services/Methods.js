import API from './API.js';

const base = import.meta.env.VITE_VUE_APP_API_BASE_URL;

export default {
    createPost(url, data, options = {}) {
        return API(base).post(url, data, options);
    },
    createPut(url, data, options = {}) {
        return API(base).put(url, data, options);
    },
    createGet(url, options = {}) {
        return API(base).get(url, options);
    },
    createDelete(url, data) {
        return API(base).delete(url, {
            data : data
        });
    },
    createPatch(url, data){
        return API(base).patch(url, data)
    }
}