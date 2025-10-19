import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Селектори
const startBtn = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');

const refs = {
  days: document.querySelector('.js-timer__days'),
  hours: document.querySelector('.js-timer__hours'),
  minutes: document.querySelector('.js-timer__minutes'),
  seconds: document.querySelector('.js-timer__seconds'),
};

let userSelectedDate = null;
let intervalId = null;

// Ініціалізація flatpickr
flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const date = selectedDates[0];

    if (date <= new Date()) {
      startBtn.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      userSelectedDate = date;
      startBtn.disabled = false;
    }
  },
});

// Функція форматування числа з 0
function pad(value) {
  return String(value).padStart(2, '0');
}

// Перетворення мс у дні/год/хв/сек
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція запуску таймера
function startTimer() {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;

  intervalId = setInterval(() => {
    const diff = userSelectedDate - new Date();

    if (diff <= 0) {
      clearInterval(intervalId);
      input.disabled = false; // після завершення таймеру можна змінювати дату
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const time = convertMs(diff);
    updateTimerDisplay(time);
  }, 1000);
}

// Функція оновлення відображення таймера
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  refs.days.textContent = pad(days);
  refs.hours.textContent = pad(hours);
  refs.minutes.textContent = pad(minutes);
  refs.seconds.textContent = pad(seconds);
}

// Обробник кнопки Start
startBtn.addEventListener('click', startTimer);
