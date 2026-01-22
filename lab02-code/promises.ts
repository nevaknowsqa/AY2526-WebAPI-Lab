import axios from 'axios';
import * as readline from 'readline-sync';

const url = 'https://data.fixer.io';
const key = 'YourAPIKey';

const getInput = () => new Promise<string>( (resolve) => {
	const base = readline.question('Enter base currency: ').toUpperCase();
  const convertTo = readline.question('Enter Exchange currency: ').toUpperCase();
  const amount = readline.question('Enter base amount: ');
  // Return the user input
  resolve({
    'base': base,
    'convert': convertTo,
    'amount': amount
  });
});

// input = user input from getInput
const checkValidCurrencyCode = (input: any) => {
  console.log(`Checking Valid Currency Code... ${input.base} & ${input.convert}`);
  
  return new Promise<string>((resolve, reject) =>{
    axios.get(`${url}/symbols?access_key=${key}`, {}).then(({data, status}) => {
      if(status===200){

        const currency = data.symbols;
        let err: boolean = false

        // Error Handling if user input incorrect -> return reject
        if (currency.hasOwnProperty(input.base)) {
          err = false
        } else {
          console.log(`invalid currency code ${input.base}`)
          err = true
        }
        if (currency.hasOwnProperty(input.convert)) { 
          if(!err) err = false
        } else {
          console.log(`invalid currency code ${input.convert}`)
          err = true
        }
        if (err)
          reject(new Error('invalid currency code found'));
        else
          // Input correct -> return the user input
          resolve(input);
      }
      reject('Connection Error'); 
    }).catch((err) => {
      reject(err);
    })
  })
}

// get the user input from checkValidCurrecyCode
const getFullName = (input: any) => {
  console.log(`Getting Full Name... ${input.base} & ${input.convert}`);
  return new Promise<string>((resolve, reject) =>{
    axios.get('https://openexchangerates.org/api/currencies.json?app_id=Your_APIKEY').then(({data, status}) => {
      if(status===200){
        const baseFullName = data[input.base];
        const convertFullName = data[input.convert];

        const fullName = {};
        fullName[input.base] = baseFullName;
        fullName[input.convert] = convertFullName;

        //return res => include: user input (base, convert currency, amount) + full name of the currency
        const res = {
          input: input,
          fullName: fullName
        }
        resolve(res);
      }
      reject('Connection Error'); 
    }).catch((err) => {
      reject(err);
    })
  })
}

// get res => include: user input (base, convert currency, amount) + full name of the currency from getFullName
const getData = (res: string) => {
  console.log('Retrieving the rate...');
  return new Promise((resolve, reject) =>{
    axios.get(`${url}/latest?base=EUR&symbols=${res.input.base},${res.input.convert}&access_key=${key}`, {}).then(({data, status}) => {
      if(status===200){
        
        //return d => include: user input (base, convert currency, amount) + full name of the currency + rate of the currency
        const d = {
          name: res.fullName,
          input: res.input,
          rate: data
        }
        resolve(d);
      } else {
        reject('Connection Error');
      }
    }).catch((err) => {
      reject(err);
    })
  })
}

//get res => include: user input (base, convert currency, amount) + full name of the currency + rate of the currency from getData
const printObject = (data: any) => new Promise<any>( resolve => {
	// console.log(data);
  const rateFrom = data.rate.rates[data.input.base];
  const rateTo = data.rate.rates[data.input.convert];

  const rate = rateTo / rateFrom;
  const exchanged = data.input.amount * rate;
  console.log(`${data.input.amount} ${data.name[data.input.base]} can exchange ${exchanged} ${data.name[data.input.convert]}`)

	resolve(null);                                      
});

const exit = () => new Promise( () => {
	process.exit();
})

getInput('enter currency: ')
	.then(checkValidCurrencyCode)
  .then(getFullName)
	.then(getData)
	.then(printObject)
	.then(exit)
	.catch( err => console.error(`error: ${err.message}`))
	.then(exit);
