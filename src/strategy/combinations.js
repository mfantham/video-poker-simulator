const productRange = (a, b) => {
  let product = a;
  let i = a;
  while (i++ < b) {
    product *= i;
  }
  return product;
};

export const choose = (n, r) => {
  // This is supposed to be a pretty speedy nCr calculator
  if (r > n) return 0;
  if (n === r || r === 0) {
    return 1;
  } else {
    r = r < n - r ? n - r : r;
    return productRange(r + 1, n) / productRange(1, n - r);
  }
};

export const ithCombination = (index, n, K) => {
  // This is optimized for speed by integrating the nCr in-line
  // which makes it a bit uglier!

  let nCk = 1;
  let j = 0;
  for (let i = n; i > n - K; i--) {
    nCk *= i;
    nCk = Math.floor(nCk / (j + 1));
    j++;
  }
  let curIndex = nCk;
  const result = [];
  for (let k = K; k > 0; k--) {
    nCk *= k;
    nCk = Math.floor(nCk / n);
    while (curIndex - nCk > index) {
      curIndex -= nCk;
      nCk *= n - k;
      nCk -= nCk % k;
      n--;
      nCk = Math.floor(nCk / n);
    }
    n--;
    result.push(n);
  }
  return result;
};

export const indexOfCombination = (combination) => {
  // Combination is an array of integers, length r
  // Note we need to sort the list in this function!
  let index = 0;
  const sorted = [...combination].sort((a, b) => a - b);
  sorted.forEach((ck, i) => {
    index += choose(ck, i + 1);
  });
  return index;
};
