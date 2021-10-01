window.addEventListener('DOMContentLoaded', (event) => {
  var activeElement = document.querySelector('#lmt-tabs a[href="' + window.location.pathname + '"]');
  if (activeElement) {
    activeElement.parentElement.classList.add('active');
  }
});
