import Notiflix from 'notiflix';

export function fetchCountries(name) {
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
