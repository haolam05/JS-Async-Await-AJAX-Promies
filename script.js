'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.official}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1_000_000
      ).toFixed(1)} million people</p>
      <p class="country__row"><span>🗣️</span>${
        data.languages[`${Object.keys(data.languages)[0]}`]
      }</p>
      <p class="country__row"><span>💰</span>${Object.keys(data.currencies)}</p>
    </div>
  </article>
`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    renderCountry(data);

    const neighbour = data.borders?.[0];
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();
    request2.addEventListener('load', function () {
      const [data] = JSON.parse(this.responseText);
      renderCountry(data, 'neighbour');
    });
  });
};
// getCountryData('france');

// const getCountryData2 = function (country) {
//   const data = fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       if (!response.ok) throw new Error(`Country not found! (${response.status})`);
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data[0]);

//       const neighbour = data[0].borders?.[0];
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(response => response.json())
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err =>
//       renderError(`Something went wrong ❌ ${err.message}. Try again!`)
//     )
//     .finally(() => (countriesContainer.style.opacity = 1));
// };
const getJSON = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errMsg} (${response.status})`);
    return response.json();
  });
};
const getCountryData2 = function (country) {
  getJSON(
    `https://restcountries.com/v3.1/name/${country}`,
    'Country not found!'
  )
    .then(data => {
      renderCountry(data[0]);

      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error('No Neighbor!');

      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found!'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err =>
      renderError(`Something went wrong ❌ ${err.message}. Try again!`)
    )
    .finally(() => (countriesContainer.style.opacity = 1));
};
btn.addEventListener('click', function () {
  // getCountryData2('usssa');
  // getCountryData2('australia');
  getCountryData2('usa');
});

// Coding Challenge #1
const whereAmI = function (lat, lng) {
  const apiKey = '120702584194319e15943700x51692';
  const url = `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`;
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Something went wrong! (${res.status})`);
      return res.json();
    })
    .then(data => {
      if (data.error) throw new Error(`Geocoding problem (${data.error.code})`);
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.log(err.message))
    .finally(() => (countriesContainer.style.opacity = 1));
};
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474);

// Microtask queue > callback queue
console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
Promise.resolve('Resolved Promise #1').then(res => console.log(res));
Promise.resolve('Resolved Promise #2').then(res => {
  for (let i = 0; i < 2 ** 30; i++) {}
  console.log(res);
});
console.log('Test end');

// Create & Consume Promises
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw is happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN 💰💸💴');
    } else {
      reject(new Error('You lost your money 💩'));
    }
  }, 2000);
});
// lotteryPromise.then(
//   res => console.log(res),
//   err => console.log(err)
// );
lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

// Promisifying callbacks
const wait = sec => new Promise(resolve => setTimeout(resolve, sec * 1000));
wait(1)
  .then(() => {
    console.log(1);
    return wait(1);
  })
  .then(() => {
    console.log(2);
    return wait(1);
  })
  .then(() => {
    console.log(3);
    return wait(1);
  })
  .then(() => {
    console.log(4);
    return wait(1);
  })
  .then(() => console.log(5));
Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Problem!')).catch(x => console.error(x));
// Callback hell
// setTimeout(() => {
//   console.log(1);
//   setTimeout(() => {
//     console.log(2);
//     setTimeout(() => {
//       console.log(3);
//       setTimeout(() => {
//         console.log(4);
//         setTimeout(() => {
//           console.log(5);
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);
