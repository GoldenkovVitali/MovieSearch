import '../css/main.scss';
import { SPESIALBUTTONS, KEYS } from './keyboardButtons';
import {
  keyboard, form, cyrillicReg, latinReg, input,
} from './variables';
import languageСheck from './languageсheck';
import getMovieSlides from './slides';

const CONTAINER = document.createElement('div');

CONTAINER.classList.add('container-keyboard');
CONTAINER.classList.add('active');
// -----------------------------------------------клавиатура----------------

let capsLock = false;
let wrapper = document.getElementById('wrapper');
// ----нажатие на кнопку клавиатуры----------------------

keyboard.addEventListener('click', () => {
  CONTAINER.classList.toggle('active');
  input.focus();
});

// -----------------------------функция добавления элементов в конец узлов------------
function addElem(child, parent) {
  // добавлем узел в конец списка дочерних элементов указанного родительского узла
  parent.appendChild(child);
}

// ----------------------------------функция создания кнопок----------------------------

function makeElem(call, text, type) {
  const element = document.createElement('element'); // создаем класс "element"
  element.id = call; // присваиваем id кнопкам исходя из его call (event.code)
  element.innerText = text; // присваиваем значение кнопке
  element.className = type; // присваиваем кнопке класс исходя из пришедшего значения объекта
  return element; // возвращаем кнопку
}

// ----------------------------функция создания клавиатуры----------------------------------------
function buildwrapper(lang) {
  wrapper = document.createElement('div'); // создаем элемент div для клавиатуры
  wrapper.className = 'element-wrapper';
  wrapper.id = 'wrapper';
  KEYS.forEach((el) => {
    // проходим по всем элементам KEYS
    const line = document.createElement('div'); // создаем новый элемент ('div') - для линий (в клавиатуре, wrapper)
    line.className = 'line'; // создаем новый класс 'line'- для элемента line

    el.forEach((elem) => {
      const indexespecial = SPESIALBUTTONS.indexOf(elem.call);

      if (indexespecial !== -1) {
        addElem(makeElem(elem.call, elem.english, elem.type), line); // добавляем спецкнопки
      }

      if (indexespecial === -1 && lang === 'en') {
        addElem(makeElem(elem.call, elem.english, 'element'), line); // добавляем кнопки обычные
      }

      if (indexespecial === -1 && lang === 'enShift') {
        addElem(makeElem(elem.call, elem.enShift, 'element'), line); // добавляем кнопки обычные
      }

      if (indexespecial === -1 && lang === 'ru') {
        addElem(makeElem(elem.call, elem.russian, 'element'), line); // добавляем кнопки обычные
      }

      if (indexespecial === -1 && lang === 'ruShift') {
        addElem(makeElem(elem.call, elem.ruShift, 'element'), line); // добавляем кнопки обычные
      }
    });
    addElem(line, wrapper); // вызываем функцию addElem с параметрами line и keyboard
  });
  return wrapper;
}

// --------------------------выбираем и сохраняем язык -------------------------------------------
let lang = localStorage.getItem('language') || 'en';
localStorage.setItem('language', lang);

// -------------------------------------меняем язык----------------------------------

document.addEventListener('keydown', (event) => {
  if (CONTAINER.className !== 'container-keyboard active') {
    event.preventDefault();
    wrapper = document.getElementById('wrapper');
    if (event.ctrlKey && event.key === 'Alt') {
      wrapper.remove();
      if (lang === 'en') {
        lang = 'ru';
        CONTAINER.appendChild(buildwrapper('ru'));
      } else {
        lang = 'en';
        CONTAINER.appendChild(buildwrapper('en'));
      }
      localStorage.setItem('language', lang);
    }
  }
});

// ----------------------------создаем архитектуру клавиатуры-------------------------------------
form.appendChild(CONTAINER); // создаем элемент CONTAINER в body
CONTAINER.appendChild(buildwrapper(lang));

// ----------------------------нажатие мышью -----------------------

CONTAINER.addEventListener('mousedown', (event) => {
  if (CONTAINER.className !== 'container-keyboard active') {
    const texterea = document.querySelector('.search-input');
    texterea.focus();
    const textarea = document.querySelector('.search-input');
    let position = textarea.selectionStart;
    const button1 = event.target;
    if (button1.id === 'MetaLeft') {
      wrapper.remove();
      event.preventDefault();
      if (lang === 'en') {
        lang = 'ru';
        CONTAINER.appendChild(buildwrapper('ru'));
        localStorage.setItem('language', lang);
        return;
      }

      if (lang === 'enShift') {
        lang = 'ruShift';
        CONTAINER.appendChild(buildwrapper('ruShift'));
        localStorage.setItem('language', lang);
        return;
      }

      if (lang === 'ru') {
        lang = 'en';
        CONTAINER.appendChild(buildwrapper('en'));
        localStorage.setItem('language', lang);
        return;
      }

      if (lang === 'ruShift') {
        lang = 'enShift';
        CONTAINER.appendChild(buildwrapper('enShift'));
        localStorage.setItem('language', lang);
      }
    }
    if (
      (button1.className === 'element' || button1.id === 'Backslash')
    && button1.innerText.length === 1 && button1.id !== 'ArrowLeft' && button1.id !== 'ArrowRight'
    && button1.id !== 'ArrowDown' && button1.id !== 'ArrowUp'
    ) {
      event.preventDefault();
      texterea.value = textarea.value.slice(0, textarea.selectionStart)
      + button1.textContent + textarea.value.slice(textarea.selectionStart);
      textarea.selectionEnd = position + 1;
      textarea.selectionStart = textarea.selectionEnd;
    }

    if (button1.id === 'Space') {
      event.preventDefault();
      position = textarea.selectionStart;
      textarea.value = `${textarea.value.slice(0, textarea.selectionStart)} ${textarea.value.slice(textarea.selectionStart)}`;
      textarea.selectionEnd = position + 1;
      textarea.selectionStart = textarea.selectionEnd;
    }

    if (button1.id === 'Backspace') {
      event.preventDefault();
      position = textarea.selectionStart;
      if (textarea.selectionStart === textarea.selectionEnd && textarea.selectionStart === 0) {
        return;
      }
      if (textarea.selectionStart === textarea.selectionEnd) {
        textarea.value = textarea.value.slice(0, textarea.selectionStart - 1)
        + textarea.value.slice(textarea.selectionStart);
        textarea.selectionEnd = position - 1;
        textarea.selectionStart = textarea.selectionEnd;
      } else {
        textarea.value = textarea.value.slice(0, textarea.selectionStart)
        + textarea.value.slice(textarea.selectionEnd);
        textarea.selectionEnd = position;
        textarea.selectionStart = textarea.selectionEnd;
      }
    }
    if (button1.id === 'Delete') {
      event.preventDefault();
      position = textarea.selectionStart;
      if (textarea.selectionStart === textarea.selectionEnd) {
        textarea.value = textarea.value.slice(0, textarea.selectionStart)
        + textarea.value.slice(textarea.selectionStart + 1);
        textarea.selectionEnd = position;
        textarea.selectionStart = textarea.selectionEnd;
      } else {
        textarea.value = textarea.value.slice(0, textarea.selectionStart)
        + textarea.value.slice(textarea.selectionEnd);
        textarea.selectionEnd = position;
        textarea.selectionStart = textarea.selectionEnd;
      }
    }
    if (button1.id === 'ArrowLeft') {
      event.preventDefault();
      textarea.selectionEnd -= 1;
      textarea.selectionStart = textarea.selectionEnd;
    }
    if (button1.id === 'ArrowRight') {
      event.preventDefault();
      textarea.selectionEnd += 1;
      textarea.selectionStart = textarea.selectionEnd;
    }
    if (button1.id === 'ArrowUp') {
      event.preventDefault();
      if (textarea.selectionStart === textarea.selectionEnd && textarea.selectionStart <= 82) {
        textarea.selectionEnd = 0;
        textarea.selectionStart = textarea.selectionEnd;
      } else {
        textarea.selectionEnd -= 82;
        textarea.selectionStart = textarea.selectionEnd;
      }
    }
    if (button1.id === 'ArrowDown') {
      event.preventDefault();
      textarea.selectionEnd += 82;
      textarea.selectionStart = textarea.selectionEnd;
    }

    if (button1.id === 'Tab') {
      event.preventDefault();
      position = textarea.selectionStart;
      textarea.value = `${textarea.value.slice(0, textarea.selectionStart)}   ${
        textarea.value.slice(textarea.selectionStart)}`;
      textarea.selectionEnd = position + 3;
      textarea.selectionStart = textarea.selectionEnd;
    }

    if (button1.id === 'Enter') {
      const word = input.value;
      document.querySelector('.info').innerText = '';
      if (cyrillicReg.test(word) && !latinReg.test(word)) {
        languageСheck(word);
      } else {
        getMovieSlides(word);
      }
    }
  }
});

// ----------------------------------анимация нажатия клавиатурой-----------------------------
document.addEventListener('keydown', (event) => {
  if (CONTAINER.className !== 'container-keyboard active') {
  // подсветка нажатых клавиш
    const active = document.querySelector(`#${event.code}`);
    active.classList.add('element-active_keyboard');
  }
});

document.addEventListener('keyup', (event) => {
  if (CONTAINER.className !== 'container-keyboard active') {
  // убираем класс актив с нажатых клавиш (после из отпускания)
    const active = document.querySelector(`#${event.code}`);
    active.classList.remove('element-active_keyboard');
  }
});

// ----------------------------нажатие клавиатурой -----------------------


document.addEventListener('keydown', (event) => {
  if (CONTAINER.className !== 'container-keyboard active') {
    const texterea = document.querySelector('.search-input');
    texterea.focus();
    const textarea = document.querySelector('.search-input');
    let position = textarea.selectionStart;
    const buttonkeyboard = event.key;

    // ---------------------CapsLocK-----------------------
    if (buttonkeyboard === 'CapsLock') {
      if (!capsLock) {
        if (lang === 'en') {
          wrapper.remove();
          CONTAINER.appendChild(buildwrapper('enShift'));
          lang = 'enShift';
          document.querySelector('#CapsLock').classList.add('active');
          capsLock = true;
          return;
        }
        if (lang === 'ru') {
          wrapper.remove();
          CONTAINER.appendChild(buildwrapper('ruShift'));
          lang = 'ruShift';
          document.querySelector('#CapsLock').classList.add('active');
          capsLock = true;
          return;
        }
        return;
      }
      if (capsLock) {
        if (lang === 'enShift') {
          wrapper.remove();
          CONTAINER.appendChild(buildwrapper('en'));
          document.querySelector('#CapsLock').classList.remove('active');
          lang = 'en';
          capsLock = false;
          return;
        }
        if (lang === 'ruShift') {
          wrapper.remove();
          CONTAINER.appendChild(buildwrapper('ru'));
          document.querySelector('#CapsLock').classList.remove('active');
          capsLock = false;
          lang = 'ru';
          capsLock = false;
          return;
        }
        return;
      }
      return;
    }

    // ---------------------------вывод символов----------------------
    const a = KEYS.flat();
    for (let i = 0; i < a.length; i += 1) {
      if (a[i].call === event.code
      && lang === 'en'
      && a[i].english.length === 1 && event.code !== 'ArrowLeft' && event.code !== 'ArrowRight'
      && event.code !== 'ArrowDown' && event.code !== 'ArrowUp'
      ) {
        event.preventDefault();
        texterea.value = textarea.value.slice(0, textarea.selectionStart)
        + a[i].english + textarea.value.slice(textarea.selectionStart);
        textarea.selectionEnd = position + 1;
        textarea.selectionStart = textarea.selectionEnd;
      }

      if (
        a[i].call === event.code
      && lang === 'enShift'
      && a[i].russian.length === 1 && event.code !== 'ArrowLeft' && event.code !== 'ArrowRight'
      && event.code !== 'ArrowDown' && event.code !== 'ArrowUp'
      ) {
        event.preventDefault();
        texterea.value = textarea.value.slice(0, textarea.selectionStart)
        + a[i].enShift + textarea.value.slice(textarea.selectionStart);
        textarea.selectionEnd = position + 1;
        textarea.selectionStart = textarea.selectionEnd;
      }

      if (
        a[i].call === event.code
      && lang === 'ru'
      && a[i].russian.length === 1 && event.code !== 'ArrowLeft' && event.code !== 'ArrowRight'
      && event.code !== 'ArrowDown' && event.code !== 'ArrowUp'
      ) {
        event.preventDefault();
        texterea.value = textarea.value.slice(0, textarea.selectionStart)
        + a[i].russian + textarea.value.slice(textarea.selectionStart);
        textarea.selectionEnd = position + 1;
        textarea.selectionStart = textarea.selectionEnd;
      }
      if (
        a[i].call === event.code
      && lang === 'ruShift'
      && a[i].russian.length === 1 && event.code !== 'ArrowLeft' && event.code !== 'ArrowRight'
      && event.code !== 'ArrowDown' && event.code !== 'ArrowUp'
      ) {
        event.preventDefault();
        texterea.value = textarea.value.slice(0, textarea.selectionStart)
        + a[i].ruShift + textarea.value.slice(textarea.selectionStart);
        textarea.selectionEnd = position + 1;
        textarea.selectionStart = textarea.selectionEnd;
      }
    }

    if (event.code === 'Space') {
      event.preventDefault();
      position = textarea.selectionStart;
      textarea.value = `${textarea.value.slice(0, textarea.selectionStart)} ${textarea.value.slice(textarea.selectionStart)}`;
      textarea.selectionEnd = position + 1;
      textarea.selectionStart = textarea.selectionEnd;
    }

    if (buttonkeyboard === 'Backspace') {
      event.preventDefault();
      position = textarea.selectionStart;
      if (textarea.selectionStart === textarea.selectionEnd && textarea.selectionStart === 0) {
        return;
      }
      if (textarea.selectionStart === textarea.selectionEnd) {
        textarea.value = textarea.value.slice(0, textarea.selectionStart - 1)
        + textarea.value.slice(textarea.selectionStart);
        textarea.selectionEnd = position - 1;
        textarea.selectionStart = textarea.selectionEnd;
      } else {
        textarea.value = textarea.value.slice(0, textarea.selectionStart)
        + textarea.value.slice(textarea.selectionEnd);
        textarea.selectionEnd = position;
        textarea.selectionStart = textarea.selectionEnd;
      }
    }

    if (buttonkeyboard === 'Delete') {
      event.preventDefault();
      position = textarea.selectionStart;
      if (textarea.selectionStart === textarea.selectionEnd) {
        textarea.value = textarea.value.slice(0, textarea.selectionStart)
        + textarea.value.slice(textarea.selectionStart + 1);
        textarea.selectionEnd = position;
        textarea.selectionStart = textarea.selectionEnd;
      } else {
        textarea.value = textarea.value.slice(0, textarea.selectionStart)
        + textarea.value.slice(textarea.selectionEnd);
        textarea.selectionEnd = position;
        textarea.selectionStart = textarea.selectionEnd;
      }
    }
    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      textarea.selectionEnd -= 1;
      textarea.selectionStart = textarea.selectionEnd;
    }
    if (event.code === 'ArrowRight') {
      event.preventDefault();
      textarea.selectionEnd += 1;
      textarea.selectionStart = textarea.selectionEnd;
    }
    if (event.code === 'ArrowUp') {
      event.preventDefault();
      if (textarea.selectionStart === textarea.selectionEnd && textarea.selectionStart <= 82) {
        textarea.selectionEnd = 0;
        textarea.selectionStart = textarea.selectionEnd;
      } else {
        textarea.selectionEnd -= 82;
        textarea.selectionStart = textarea.selectionEnd;
      }
    }
    if (event.code === 'ArrowDown') {
      event.preventDefault();
      textarea.selectionEnd += 82;
      textarea.selectionStart = textarea.selectionEnd;
    }

    if (buttonkeyboard === 'Tab') {
      event.preventDefault();
      position = textarea.selectionStart;
      textarea.value = `${textarea.value.slice(0, textarea.selectionStart)}   ${
        textarea.value.slice(textarea.selectionStart)}`;
      textarea.selectionEnd = position + 3;
      textarea.selectionStart = textarea.selectionEnd;
    }
  }
});
