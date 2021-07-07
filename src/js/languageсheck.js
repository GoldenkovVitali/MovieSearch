import getMovieSlides from './slides';

// --------------------------------функция проверки языка----------------
export default async function languageСheck(word) {
  const res = await fetch(
    `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=${word}&langpair=ru|en`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '8c7a62bd09msha0fcd2de5032f4ap1e9fbdjsncf7dd3c862f8',
        'x-rapidapi-host':
          'translated-mymemory---translation-memory.p.rapidapi.com',
      },
    },
  );
  const data = await res.json();
  getMovieSlides(data.responseData.translatedText);
  document.querySelector(
    '.search-input',
  ).value = `${data.responseData.translatedText}`;
}
