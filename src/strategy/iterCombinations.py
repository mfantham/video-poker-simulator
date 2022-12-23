def iterCombination(index, n, k):
    '''Yields the items of the single combination that would be at the provided
    (0-based) index in a lexicographically sorted list of combinations of choices
    of k items from n items [0,n), given the combinations were sorted in
    descending order. Yields in descending order.
    '''
    if index < 0 or index >= choose(n, k):
        return
    n -= 1
    for i in range(k):
        while choose(n, k) > index:
            n -= 1
        yield n
        index -= choose(n, k)
        n -= 1
        k -= 1

def choose(n, k):
    '''Returns the number of ways to choose k items from n items'''
    reflect = n - k
    if k > reflect:
        if k > n:
            return 0
        k = reflect
    if k == 0:
        return 1
    for nMinusIPlus1, i in zip(range(n - 1, n - k, -1), range(2, k + 1)):
        n = n * nMinusIPlus1 // i
    return n