import Swiper from '../../node_modules/swiper/js/swiper.min';

const swiper = new Swiper('.swiper-container', {
  speed: 700,
  spaceBetween: 80,
  loop: false,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
    dynamicMainBullets: 4,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    50: {
      slidesPerView: 1,
    },
    700: {
      slidesPerView: 2,
    },
    1200: {
      slidesPerView: 3,
    },
    1660: {
      slidesPerView: 4,
    },
  },
});
export default swiper;
