const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a * b < 0) return reject('Numbers must be non negative');
      resolve(a + b);
    }, 2000);
  });
};

const doWrok = async () => {
  const sum = await add(1, 99);
  console.log(typeof sum);
  const sum2 = await add(sum, -50);
  console.log(sum2);
  return sum2;
};

doWrok()
  .then(result => {
    console.log('result', result);
  })
  .catch(e => console.log(e));
