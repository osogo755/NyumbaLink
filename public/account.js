const roleButtons = document.querySelectorAll('.role-btn');
const customerSummary = document.getElementById('customerSummary');
const ownerSummary = document.getElementById('ownerSummary');
const customerTable = document.getElementById('customerTable');
const ownerTable = document.getElementById('ownerTable');
const recordsTitle = document.getElementById('recordsTitle');
const accountSubtitle = document.getElementById('accountSubtitle');
const tenantHousesSection = document.getElementById('tenantHousesSection');

let activeHouseCategory = 'all';
let activeHouseSearch = '';

function setRole(role) {
  roleButtons.forEach(b => b.classList.toggle('active', b.dataset.role === role));

  if (role === 'owner' || role === 'landlord') {
    customerSummary.classList.add('hidden');
    ownerSummary.classList.remove('hidden');
    customerTable.classList.add('hidden');
    ownerTable.classList.remove('hidden');
    if (tenantHousesSection) tenantHousesSection.classList.add('hidden');
    recordsTitle.textContent = 'Property booking history';
    accountSubtitle.textContent = 'Signed in as a landlord / caretaker.';
    document.getElementById('manageBtn').classList.remove('hidden');
  } else {
    customerSummary.classList.remove('hidden');
    ownerSummary.classList.add('hidden');
    customerTable.classList.remove('hidden');
    ownerTable.classList.add('hidden');
    if (tenantHousesSection) tenantHousesSection.classList.remove('hidden');
    recordsTitle.textContent = 'Rental booking history';
    accountSubtitle.textContent = 'Signed in as a tenant.';
    document.getElementById('manageBtn').classList.add('hidden');
    renderTenantHouses();
  }
}

// Render verified registered houses for tenants
function renderTenantHouses(catFilter, query) {
  if (catFilter !== undefined) activeHouseCategory = catFilter;
  if (query !== undefined) activeHouseSearch = query.trim().toLowerCase();

  const grid = document.getElementById('tenantHousesGrid');
  if (!grid || !window.SynchroService) return;

  const allProps = window.SynchroService.getProperties();
  const approvedProps = window.SynchroService.getApprovedProperties();

  // Update total count
  const allCountSpan = document.getElementById('allHousesCount');
  if (allCountSpan) allCountSpan.textContent = approvedProps.length;

  let filtered = approvedProps;

  // Filter by category
  if (activeHouseCategory && activeHouseCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeHouseCategory);
  }

  // Filter by search query
  if (activeHouseSearch) {
    filtered = filtered.filter(p => 
      (p.name && p.name.toLowerCase().includes(activeHouseSearch)) ||
      (p.location && p.location.toLowerCase().includes(activeHouseSearch)) ||
      (p.cadastralTitleNo && p.cadastralTitleNo.toLowerCase().includes(activeHouseSearch)) ||
      (p.id && p.id.toLowerCase().includes(activeHouseSearch)) ||
      (p.category && p.category.toLowerCase().includes(activeHouseSearch))
    );
  }

  if (!filtered.length) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; background: var(--surface); border: 1px dashed var(--border); border-radius: 14px; padding: 36px 20px; text-align: center;">
        <p style="font-family: var(--font-display); font-weight: 600; font-size: 1.1rem; color: var(--ink); margin-bottom: 6px;">No registered houses found</p>
        <p style="font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 16px;">Try adjusting your search terms or category filter to view other certified houses.</p>
        <button type="button" class="btn btn-ghost" onclick="resetHouseFilters()" style="font-size: 0.8rem; padding: 8px 16px;">Reset Filter &amp; Show All</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isVacant = p.vacantCount > 0;
    const availBadge = isVacant
      ? `<span class="house-badge-avail">✓ ${p.vacantCount} vacant</span>`
      : `<span class="house-badge-occupied">Fully occupied</span>`;

    const catLabel = p.category ? (p.category.charAt(0).toUpperCase() + p.category.slice(1)) : 'Rental';

    return `
      <article class="house-card">
        <div class="house-media">
          <img src="${p.imageUrl}" alt="${p.name}">
          ${availBadge}
        </div>
        <div class="house-body">
          <div class="house-kind-row">
            <span>${catLabel}</span>
            <span>${p.id}</span>
          </div>
          <h3 class="house-title">${p.name}</h3>
          <p class="house-loc">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${p.location}</span>
          </p>

          <div class="house-title-cert">
            <span>✓ Verified Title Deed:</span>
            <strong>${p.cadastralTitleNo}</strong>
          </div>

          <p class="house-synchro-tag">
            <span>🔒 Protected by Synchro Escrow</span>
          </p>

          <div class="house-price-row">
            <div>
              <span style="font-size: 0.72rem; color: var(--ink-soft); display: block;">Monthly Rent</span>
              <span class="house-price">KSh ${p.priceKES.toLocaleString()}<small style="font-size: 0.72rem; font-weight: normal; color: var(--ink-soft);">/mo</small></span>
            </div>
            <div style="font-size: 0.75rem; text-align: right; color: var(--teal); font-weight: 600;">
              Zero broker fees
            </div>
          </div>

          <div class="house-actions">
            <a href="listing.html?prop=${p.id}" class="house-btn-apply">Apply &amp; Reserve</a>
            <a href="listing.html?prop=${p.id}" class="house-btn-view">Details</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.renderTenantHouses = renderTenantHouses;

function resetHouseFilters() {
  activeHouseCategory = 'all';
  activeHouseSearch = '';
  const searchInput = document.getElementById('tenantHouseSearch');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.house-filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category === 'all');
  });
  renderTenantHouses('all', '');
}
window.resetHouseFilters = resetHouseFilters;

// Filter pill click listeners
document.querySelectorAll('.house-filter-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.house-filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderTenantHouses(pill.dataset.category);
  });
});

// Search input listener
const houseSearchInput = document.getElementById('tenantHouseSearch');
if (houseSearchInput) {
  houseSearchInput.addEventListener('input', (e) => {
    renderTenantHouses(undefined, e.target.value);
  });
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
    window.location.href = 'index.html';
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


