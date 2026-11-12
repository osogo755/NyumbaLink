let currentRole = 'tenant'; // 'tenant' | 'landlord' | 'admin'
let currentMode = 'login'; // 'login' | 'signup'

const modeButtons = document.querySelectorAll('.mode-btn');
const submitBtn = document.getElementById('submitBtn');
const roleBadge = document.getElementById('roleBadge');
const pillTenant = document.getElementById('pillTenant');
const pillLandlord = document.getElementById('pillLandlord');
const inputIdentifier = document.getElementById('inputIdentifier');
const inputPassword = document.getElementById('inputPassword');

function updateUI() {
  pillTenant.classList.toggle('active', currentRole === 'tenant');
  pillLandlord.classList.toggle('active', currentRole === 'landlord');

  const actionText = currentMode === 'signup' ? 'Create Account' : 'Sign In';

  if (currentRole === 'tenant') {
    roleBadge.textContent = 'Role: Tenant (Housing Search & Escrow Deposit)';
    roleBadge.style.color = '#4A3F8C';
    roleBadge.style.background = 'rgba(74,63,140,0.1)';
    submitBtn.textContent = actionText + ' as Tenant';
  } else if (currentRole === 'landlord') {
    roleBadge.textContent = 'Role: Landlord / Caretaker (Register & Manage Houses)';
    roleBadge.style.color = '#1F9E7C';
    roleBadge.style.background = 'rgba(31,158,124,0.1)';
    submitBtn.textContent = actionText + ' as Landlord';
  } else if (currentRole === 'admin') {
    roleBadge.textContent = 'Role: Platform Administrator (Private Synchro Escrow)';
    roleBadge.style.color = '#8A4C00';
    roleBadge.style.background = '#FBEBD4';
    submitBtn.textContent = 'Sign In to Admin Command Center';
  }
}

function selectRole(role) {
  currentRole = role;
  if (role === 'landlord' && (inputIdentifier.value === '0700 882 119' || !inputIdentifier.value)) {
    inputIdentifier.value = '0712 345 678';
    inputPassword.value = 'landlordPass2026';
  } else if (role === 'tenant' && (inputIdentifier.value === '0712 345 678' || !inputIdentifier.value)) {
    inputIdentifier.value = '0700 882 119';
    inputPassword.value = 'tenantPass2026';
  }
  updateUI();
}

function autofillRole(role) {
  currentRole = role;
  if (role === 'tenant') {
    inputIdentifier.value = '0700 882 119';
    inputPassword.value = 'tenantPass2026';
  } else if (role === 'landlord') {
    inputIdentifier.value = '0712 345 678';
    inputPassword.value = 'landlordPass2026';
  } else if (role === 'admin') {
    inputIdentifier.value = 'admin@gmail.com';
    inputPassword.value = 'Admin2026';
  }
  updateUI();
}

modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    updateUI();
  });
});

function handleSubmit(e) {
  e.preventDefault();
  const ident = inputIdentifier.value.trim().toLowerCase();
  const pass = inputPassword.value.trim();

  // Validate Admin authentication specifically
  if (currentRole === 'admin' || ident === 'admin@gmail.com') {
    if (ident === 'admin@gmail.com' && pass === 'Admin2026') {
      localStorage.setItem('findaz_admin_access', 'granted');
      localStorage.setItem('findaz_auth_user', JSON.stringify({
        identifier: 'admin@gmail.com',
        role: 'admin',
        signedInAt: new Date().toISOString()
      }));
      window.location.href = 'admin.html';
      return false;
    } else {
      alert('Invalid admin credentials. Please use email: admin@gmail.com and password: Admin2026');
      return false;
    }
  }

  // Set auth session role in localStorage for tenant / landlord
  localStorage.setItem('findaz_auth_user', JSON.stringify({
    identifier: inputIdentifier.value,
    role: currentRole,
    signedInAt: new Date().toISOString()
  }));

  if (currentRole === 'landlord') {
    window.location.href = 'owner-dashboard.html';
  } else {
    // Tenant view
    window.location.href = 'account.html?type=customer';
  }

  return false;
}

// Check if role was requested via query param (e.g. signin.html?role=admin)
const params = new URLSearchParams(window.location.search);
if (params.get('role') === 'landlord') {
  selectRole('landlord');
} else if (params.get('role') === 'admin') {
  selectRole('admin');
  inputIdentifier.value = 'admin@gmail.com';
  inputPassword.value = 'Admin2026';
} else {
  updateUI();
}
