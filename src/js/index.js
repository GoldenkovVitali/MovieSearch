import '../css/main.scss';
import '../../node_modules/swiper/css/swiper.min.css';
import swiper from './swiper';
import languageСheck from './languageсheck';
import getMovieSlides from './slides';
import {
  clear, button, input, swiperButton,
} from './variables';
import hasRussianLetter from './hasRussianLetter';
import { } from './keyboard';

let currentPage = 1;
const swiperPagination = document.querySelector('.swiper-pagination');

// -------------отрисовка слайдера  исходя из ширины страницы--------------
function sliderAdaptive(word) {
  if ((window.innerWidth <= 700) && (swiper.activeIndex === 9)) {
    currentPage += 1;
    getMovieSlides(word, currentPage);
  }
  if ((window.innerWidth > 700 && window.innerWidth <= 1200) && (swiper.activeIndex === 8)) {
    currentPage += 1;
    getMovieSlides(word, currentPage);
  }
  if ((window.innerWidth > 1200 && window.innerWidth <= 1600) && (swiper.activeIndex === 7)) {
    currentPage += 1;
    getMovieSlides(word, currentPage);
  }
  if ((window.innerWidth > 1600) && (swiper.activeIndex === 6)) {
    currentPage += 1;
    getMovieSlides(word, currentPage);
  }
}
// -------------отрисовка слайдера назад--------------
swiperButton.addEventListener('click', () => {
  const wordNew = input.value;
  if (currentPage !== 1 && wordNew === '' && document.querySelector('.info').innerText === 'Showing results for "love"' && swiper.activeIndex === 0) {
    currentPage -= 1;
    getMovieSlides('love', currentPage);
  }
  if (wordNew !== '' && currentPage !== 1 && swiper.activeIndex === 0 && document.querySelector('.info').innerText !== 'Showing results for "love"') {
    currentPage -= 1;
    getMovieSlides(wordNew, currentPage);
  }
});

swiperPagination.addEventListener('click', () => {
  const wordNew = input.value;
  if (currentPage !== 1 && wordNew === '' && document.querySelector('.info').innerText === 'Showing results for "love"' && swiper.activeIndex === 0) {
    currentPage -= 1;
    getMovieSlides('love', currentPage);
  }
  if (wordNew !== '' && currentPage !== 1 && swiper.activeIndex === 0 && document.querySelector('.info').innerText !== 'Showing results for "love"') {
    currentPage -= 1;
    getMovieSlides(wordNew, currentPage);
  }
});

// -----------------отрисока слайдера и его продолжение при достижении последнего слайда
swiper.on('slideChange', () => {
  const word = input.value;
  if (word === '' && document.querySelector('.info').innerText === 'Showing results for "love"') {
    sliderAdaptive('love');
    return false;
  }
  if (word === '') {
    return false;
  }
  sliderAdaptive(word);
  return false;
});

// ---------------------------отрисовка слайдера при вводе слова из инпута--------------------

// --------------------нажатие на кнопку--------------
button.addEventListener('click', () => {
  currentPage = 1;
  const word = input.value;
  document.querySelector('.info').innerText = '';
  if (hasRussianLetter(input.value)) {
    languageСheck(word);
  } else {
    getMovieSlides(word);
  }
});

// --------------------нажатие на enter--------------
document.addEventListener('keydown', (event) => {
  currentPage = 1;
  document.querySelector('.info').innerText = '';
  if (event.key === 'Enter') {
    event.preventDefault();
    const word = document.querySelector('.search-input').value;
    if (hasRussianLetter(input.value)) {
      languageСheck(word);
    } else {
      getMovieSlides(word);
    }
  }
});

// --------------------очистка input--------------
clear.addEventListener('click', () => {
  document.querySelector('.search-input').value = '';
  input.focus();
});

// ---------------------------микрофон--------------------------------

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const microphoneBtn = document.querySelector('.micro-button');
const recognition = new window.SpeechRecognition();
recognition.interimResults = false;
recognition.maxAlternatives = 2;
recognition.continuous = false;

recognition.onresult = (event) => {
  for (let i = event.resultIndex, len = event.results.length; i < len; i += 1) {
    const { transcript } = event.results[i][0];
    if (event.results[i].isFinal) {
      input.value = transcript;
    } else {
      input.value = transcript;
    }
  }
  microphoneBtn.classList.remove('microphone-active');
  button.click();
};

recognition.onaudioend = () => {
  microphoneBtn.classList.remove('microphone-active');
};

const microphoneactivated = () => {
  microphoneBtn.addEventListener('click', () => {
    if (!microphoneBtn.classList.contains('microphone-active')) {
      microphoneBtn.classList.add('microphone-active');
      recognition.start();
    } else {
      microphoneBtn.classList.remove('microphone-active');
      recognition.stop();
    }
  });
};
microphoneactivated();
