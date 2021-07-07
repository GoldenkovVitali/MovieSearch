import swiper from './swiper';
import toSlide from './toslide';
import { key } from './variables';

const spinner = document.querySelector('#spinner');
const fetch = require('node-fetch');

export default async function getMovieSlides(word, num) {
  spinner.style.display = 'block';
  document.querySelector('.info').innerText = '';
  const url = `https://www.omdbapi.com/?s=${word}&apikey=${key}&type=movie&page=${num}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.Response === 'True') {
    const card = data.Search.map((item) => toSlide(item, num));
    await Promise.all(card);
    swiper.removeAllSlides();
    card.forEach((item) => item.then((result) => swiper.appendSlide(result)));
    document.querySelector('.info').innerText = `Showing results for "${word}"`;
  } else {
    document.querySelector('.info').innerText = 'Something ment wrong';
    if (data.Error === 'Movie not found!') {
      document.querySelector('.info').innerText = `No results for "${word}"`;
    }
    if (data.Error === 'Too many results.') {
      document.querySelector('.info').innerText = `There are too many results to "${word}" search`;
    }
    if (data.Error === 'Something went wrong.') {
      document.querySelector('.info').innerText = 'You did not enter a search query';
    }
  }
  spinner.style.display = 'none';
}

(async function check() {
  try {
    await getMovieSlides();
  } catch (err) {
    document.querySelector('.info').innerText = `Something ment wrong, ${err.message}`;
    console.error('Something ment wrong', err);
  }
}());

getMovieSlides('love', 1);
