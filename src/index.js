import './css/styles.css';
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
  inputBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.countryList.setAttribute('style', 'list-style:none');
refs.inputBox.addEventListener(
  'input',
  debounce(countrySearch, DEBOUNCE_DELAY)
);

function countrySearch(e) {
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }
  fetchCountries(inputValue)
    .then(country => {
      if (country.length > '10') {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (country.length === 1) {
        createMarkupInfo(country);
        refs.countryList.innerHTML = '';
      } else {
        createMarkupList(country);
        refs.countryInfo.innerHTML = '';
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function fetchCountries(name) {
  const URL = `https://restcountries.com/v3.1/name/${name}`;
  return fetch(
    `${URL}?fields=name,capital,population,flags,languages,translation`
  ).then(responce => {
    if (!responce.ok) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
    return responce.json();
  });
}

function createMarkupInfo(countries) {
  const offlang = countries
    .map(({ languages }) => {
      return Object.values(languages);
    })
    .join('');
  const markup = countries
    .map(({ name: { official }, capital, population, flags: { svg } }) => {
      return `<ul style="list-style: none;"><li>
      <img src="${svg}" alt="name" width="40" height="30"/> <span><b>${official}</b></span>
      </li>
      <li><b>Capital:</b> ${capital}</li>
      <li><b>Population:</b> ${population}</li>
      <li><b>Languages:</b> ${offlang}</li></ul>`;
    })
    .join('');

  refs.countryInfo.innerHTML = markup;
}

function createMarkupList(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li>
        <img src="${svg}" alt="name" width="40" height="25"/> <span><b>${official}</b></span>
      </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}
