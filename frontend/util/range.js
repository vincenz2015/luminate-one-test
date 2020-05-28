// generate a range of integers between two numbers
// inclusive of lo and hi
// e.g. 1, 5 = [1, 2, 3, 4, 5]
// will flip lo and hi if in the wrong order
export default (lo, hi) => {
    if (lo > hi) [lo, hi] = [hi, lo]
    const res = []
    for (let i = lo; i <= hi; i++) res.push(i)
    return res
}