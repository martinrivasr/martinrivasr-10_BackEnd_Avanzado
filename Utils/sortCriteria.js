        // Sorting
export function buildSortCriteria(query){
    const sort = query.sort || 'product';
    const direction = query.direction === 'desc' ? -1 : 1;

    // sortin options
    let sortCriteria = {};
    if (sort === 'owner') {
        sortCriteria = { 'owner.name': direction };
    } else if (sort === 'tags') {
        sortCriteria = { 'tags.tagname': direction };
    } else {
        sortCriteria = { [sort]: direction };
    }
    return sortCriteria
}
