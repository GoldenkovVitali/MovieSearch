// ------------создание страницы слайдера------------
import getRating from './getRating';

const toSlide = async (film, num) => {
  const card = document.createElement('div');
  const cardLink = document.createElement('a');
  const cardImage = document.createElement('img');
  const cardFooter = document.createElement('div');
  const cardImbd = document.createElement('div');
  const cardRating = document.createElement('span');
  card.classList.add('card');
  card.classList.add('swiper-slide');
  cardLink.classList.add('card-header');

  cardLink.href = `https://www.imdb.com/title/${film.imdbID}/videogallery`;
  cardLink.target = '_blank';
  cardLink.innerText = film.Title;
  cardLink.setAttribute('title', `${film.Title}`);
  cardImage.classList.add('card-body');
  cardImage.alt = 'poster';
  try {
    if (film.Poster === 'N/A') {
      cardImage.src = '../img/no-poster.jpg';
    } else {
      await fetch(film.Poster);
      cardImage.src = film.Poster;
    }
  } catch (err) {
    cardImage.src = '../img/no-poster.jpg';
    document.querySelector('.info').innerText = 'You did not enter a search query';
    console.error('we have troble with Poster', film.Poster);
  }

  cardFooter.classList.add('card-footer');
  cardFooter.innerText = film.Year;
  cardImbd.classList.add('card-imbd');
  cardRating.innerText = await getRating(film.imdbID, num);
  cardImbd.append(cardRating);
  card.append(cardLink);
  card.append(cardImage);
  card.append(cardFooter);
  card.append(cardImbd);
  return card;
};

export default toSlide;
