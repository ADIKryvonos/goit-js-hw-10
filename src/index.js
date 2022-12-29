import './css/styles.css';
import { fetchCountries } from './fetchCountries';
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
    resetCountryInfo();
    resetCountryList();
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
        resetCountryList();
      } else {
        createMarkupList(country);
        resetCountryInfo();
      }
    })
    .catch(error => {
      console.log(error);
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
      return `<ul style="list-style: none;"><li style="font-size: 30px;">
      <img src="${svg}" alt="name" width="40" height="25"/> <span><b>${official}</b></span>
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
      return `<li style="font-size: 20px;">
        <img src="${svg}" alt="name" width="40" height="25"/> <span><b>${official}</b></span>
      </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markup;
}

function resetCountryInfo() {
  refs.countryInfo.innerHTML = '';
}

function resetCountryList() {
  refs.countryList.innerHTML = '';
}
