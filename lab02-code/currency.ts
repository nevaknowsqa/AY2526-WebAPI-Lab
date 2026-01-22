import axios from 'axios';

const exchange = async (from: string, to: string) => {
  // const url = `https://data.fixer.io/api/latest?base=EUR&symbols=${symbol}&access_key=Your_APIKEY`;
  const url = `https://api.exchangeratesapi.io/v1/latest?access_key=Your_APIKEY&base=EUR&symbols=${from},${to}`;
  const options = {
    url: url,
  };
  try{
    const { data, status } = await axios.get(url, options);
    // console.log(`${status}`);
    // console.log(data.rates[from], data.rates[to])

    const fromRate = data.rates[from];
    const toRate = data.rates[to];

    if ( fromRate === undefined ){
      throw new Error(`Unknown Symbol ${from}`)
    }

    if ( toRate === undefined ){
      throw new Error(`Unknown Symbol ${to}`)
    }

    const rate = toRate / fromRate;
    return rate.toFixed(2);

  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      // return err.message;
      throw new Error(err.message);
    } else {
      // return err
      throw new Error(err);
    }
  }
}

try {
  if (process.argv.length < 4) {
    throw 'missing parameter'
  } else {
    const from = process.argv[2].toUpperCase();
    const to = process.argv[3].toUpperCase();

    exchange(from, to)
    .then((res)=> {
          console.log(`1 ${from} : ${res} ${to}`);
    })
    .catch((err) => {
      console.log(err.message);
    });
  }
} catch (err: any) {
  console.log(`${err} Usage: currency [From symbol] [To symbol] e.g. currency hkd jpy`)
}
