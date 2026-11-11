const roleButtons = document.querySelectorAll('.role-btn');
const customerSummary = document.getElementById('customerSummary');
const ownerSummary = document.getElementById('ownerSummary');
const customerTable = document.getElementById('customerTable');
const ownerTable = document.getElementById('ownerTable');
const recordsTitle = document.getElementById('recordsTitle');
const accountSubtitle = document.getElementById('accountSubtitle');

function setRole(role) {
  roleButtons.forEach(b => b.classList.toggle('active', b.dataset.role === role));

  if (role === 'owner') {
    customerSummary.classList.add('hidden');
    ownerSummary.classList.remove('hidden');
    customerTable.classList.add('hidden');
    ownerTable.classList.remove('hidden');
    recordsTitle.textContent = 'Property booking history';
    accountSubtitle.textContent = 'Signed in as a landlord / caretaker.';
    document.getElementById('manageBtn').classList.remove('hidden');
  } else {
    customerSummary.classList.remove('hidden');
    ownerSummary.classList.add('hidden');
    customerTable.classList.remove('hidden');
    ownerTable.classList.add('hidden');
    recordsTitle.textContent = 'Rental booking history';
    accountSubtitle.textContent = 'Signed in as a tenant.';
    document.getElementById('manageBtn').classList.add('hidden');
  }
}

roleButtons.forEach(btn => {
  btn.addEventListener('click', () => setRole(btn.dataset.role));
});

// Land on the right view based on what was chosen at sign-in/sign-up
const params = new URLSearchParams(window.location.search);
if (params.get('type') === 'owner') {
  setRole('owner');
}
