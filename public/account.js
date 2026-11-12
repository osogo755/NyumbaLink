const roleButtons = document.querySelectorAll('.role-btn');
const customerSummary = document.getElementById('customerSummary');
const ownerSummary = document.getElementById('ownerSummary');
const customerTable = document.getElementById('customerTable');
const ownerTable = document.getElementById('ownerTable');
const recordsTitle = document.getElementById('recordsTitle');
const accountSubtitle = document.getElementById('accountSubtitle');

function setRole(role) {
  roleButtons.forEach(b => b.classList.toggle('active', b.dataset.role === role));

  if (role === 'owner' || role === 'landlord') {
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
  btn.addEventListener('click', () => {
    const role = btn.dataset.role;
    setRole(role);
    // Sync session user role to match selected view
    const authRaw = localStorage.getItem('findaz_auth_user');
    if (authRaw) {
      try {
        const u = JSON.parse(authRaw);
        u.role = (role === 'owner' || role === 'landlord') ? 'landlord' : 'tenant';
        localStorage.setItem('findaz_auth_user', JSON.stringify(u));
      } catch(e){}
    }
  });
});

// Explicit Sign Out button listener
const signoutBtn = document.getElementById('signoutBtn');
if (signoutBtn) {
  signoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('findaz_auth_user');
    localStorage.removeItem('findaz_admin_access');
    window.location.href = 'signin.html';
  });
}

// Check session and URL query parameter to land on the right initial view
const storedAuthRaw = localStorage.getItem('findaz_auth_user');
let initialRole = 'customer';

if (storedAuthRaw) {
  try {
    const user = JSON.parse(storedAuthRaw);
    if (user.role === 'landlord' || user.role === 'owner') {
      initialRole = 'owner';
    }
  } catch(e){}
}

const params = new URLSearchParams(window.location.search);
if (params.get('type') === 'owner' || params.get('type') === 'landlord') {
  initialRole = 'owner';
} else if (params.get('type') === 'customer' || params.get('type') === 'tenant') {
  initialRole = 'customer';
}

setRole(initialRole);

