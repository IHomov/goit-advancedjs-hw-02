// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#delayForm');

form.addEventListener('submit', event => {
  event.preventDefault();
  const elements = event.currentTarget.elements;
  const delayInput = Number(elements.delay.value);
  const selectedRB = form.elements.state.value;

  if (isNaN(delayInput) || delayInput < 0) {
    iziToast.error({
      title: 'Error',
      message: 'Delay must be a positive number',
    });
    return;
  }
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (selectedRB === 'fulfilled') {
        resolve(delayInput);
      } else {
        reject(delayInput);
      }
    }, delayInput);
  });

  promise
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
        class: 'custom-snackbar-succes',
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        class: 'custom-snackbar-error',
        position: 'topRight',
      });
    });

  form.reset();
});
