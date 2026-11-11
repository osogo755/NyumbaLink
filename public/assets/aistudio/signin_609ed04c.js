const modeButtons = document.querySelectorAll('.mode-btn');
const accountType = document.getElementById('accountType');
const submitBtn = document.getElementById('submitBtn');

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.mode === 'signup') {
      accountType.classList.add('show');
      submitBtn.textContent = 'Create account';
    } else {
      accountType.classList.remove('show');
      submitBtn.textContent = 'Sign in';
    }
  });
});

function handleSubmit(e) {
  e.preventDefault();
  const type = document.querySelector('input[name="accountType"]:checked').value;
  window.location.href = 'account.html?type=' + type;
  return false;
}
