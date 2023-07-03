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
// btn.addEventListener('click', function () {
// getCountryData2('usssa');
// getCountryData2('australia');
// getCountryData2('usa');
// });

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
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);

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

// Promisifying geolocation
/** original
navigator.geolocation.getCurrentPosition(
  position => console.log(position),
  error => console.log(error)
);
console.log('Getting position');
*/
/** Solution #1 
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos),
      err => reject(err)
    );
  });
};*/
/** Solution #2 */
const getPosition = function () {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
};
const getJSON2 = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errMsg} (${response.status})`);
    return response.json();
  });
};
const whereAmI2 = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      const apiKey = '358717509146066819060x13751';
      const url = `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`;
      return getJSON2(url);
    })
    .then(data => {
      console.log(data);
      if (data.error) throw new Error(`Geocoding problem (${data.error.code})`);
      console.log(`You are in ${data.city}, ${data.country}`);
      return getJSON2(
        `https://restcountries.com/v3.1/name/${data.country}`,
        `Country not found`
      );
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.log(err.message))
    .finally(() => (countriesContainer.style.opacity = 1));
};
// btn.addEventListener('click', whereAmI2);

// Coding Challenge #2
const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      document.querySelector('.images').append(img);
      resolve(img);
    });
    img.addEventListener('error', () =>
      reject(new Error(`Image not found: wrong path (${imgPath})`))
    );
  });
};

// let currImgID = 1;
// let currImg;
// createImage(`img/img-${currImgID}.jpg`)
//   .then(img => {
//     currImg = img;
//     currImgID++;
//     return wait(2);
//   })
//   .then(() => {
//     currImg.style.display = 'none';
//     return createImage(`img/img-${currImgID}.jpg`);
//   })
//   .then(img => {
//     currImg = img;
//     currImgID++;
//     return wait(2);
//   })
//   .then(() => {
//     currImg.style.display = 'none';
//     return createImage(`img/img-${currImgID}.jpg`);
//   })
//   .catch(err => alert(err.message));

// Consuming promises with async/await
const whereAmI3 = async function () {
  try {
    const position = await getPosition();
    const apiKey = '358717509146066819060x13751';
    const { latitude: lat, longitude: lng } = position.coords;
    const urlGeo = `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`;

    const responseGeo = await fetch(urlGeo);
    if (!responseGeo.ok) throw new Error('Problem getting location data');
    const dataGeo = await responseGeo.json();
    // console.log(`You are in ${dataGeo.city}, ${dataGeo.country}`);

    const urlCountry = `https://restcountries.com/v3.1/name/${dataGeo.country}`;
    const responseCountry = await fetch(urlCountry);
    if (!responseCountry.ok) throw new Error('Problem getting country data');
    const dataCountry = await responseCountry.json();
    console.log(dataCountry);
    renderCountry(dataCountry[0]);
    countriesContainer.style.opacity = 1;
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(err);
    renderError(`${err.message} ❌`);
  }
};
btn.addEventListener('click', whereAmI3);
// console.log('1: Will get location');
// whereAmI3()
//   .then(res => console.log(`2: ${res}`))
//   .catch(err => console.log(`${err.errMsg} ❌`))
//   .finally(() => console.log('3: Finished getting location'));
console.log('1: Will get location');
// (async () => {
//   try {
//     const response = await whereAmI3();
//     console.log(`2: ${response}`);
//   } catch (err) {
//     console.log(`${err.errMsg} ❌`);
//   }
//   console.log('3: Finished getting location');
// })();

// Running Promises in Parallel
const get3Countries = async function (c1, c2, c3) {
  try {
    // order of execution: data1 -> data2 -> data3 (due to await)
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);
    // console.log([data1.capital[0], data2.capital[0], data3.capital[0]]);

    const promise1 = getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    const promise2 = getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    const promise3 = getJSON(`https://restcountries.com/v3.1/name/${c3}`);
    const data = await Promise.all([promise1, promise2, promise3]);
    console.log(data.map(d => d[0].capital[0]));
  } catch (err) {
    console.error(err);
  }
};
get3Countries('usa', 'portugal', 'italy');

// Promise.race
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
  ]);
  console.log(res[0]);
})();
// Set time limit for a fetch
const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(() => reject(new Error('Request took too long!')), sec * 1000);
  });
};
Promise.race([getJSON(`https://restcountries.com/v3.1/name/italy`), timeout(2)])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

// Promise.allSettled
Promise.allSettled([
  Promise.resolve('success'),
  Promise.reject('ERROR'),
  Promise.resolve('another success'),
]).then(res => console.log(res));

// Promise.any
Promise.any([
  Promise.reject('ERROR'),
  Promise.resolve('another success'),
  Promise.resolve('success'),
]).then(res => console.log(res));
