let nextid = 1
export default {
    post: (url, item) => Promise.resolve({
        data: Object.assign({}, item, { id: nextid++ }) }),
    patch: (url, item) => Promise.resolve({
        data: Object.assign({}, item) }),
    delete: (url) => Promise.resolve(),
    get: (url) => Promise.resolve({ data: [] })
}