// Gallery thumbnail switching
const thumbs = document.querySelectorAll('.thumb');
const mainImage = document.getElementById('mainImage');
const galleryCount = document.getElementById('galleryCount');
const totalImages = thumbs.length;

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    mainImage.src = thumb.src.replace('w=200&h=150', 'w=900&h=600');
    galleryCount.textContent = (parseInt(thumb.dataset.index) + 1) + ' / ' + totalImages;
  });
});

// Reveal phone number
function revealPhone() {
  const phone = window._ownerPhone || '+254 712 345 678';
  document.getElementById('phoneNumber').textContent = phone;
  document.getElementById('revealPhoneBtn').textContent = 'Number revealed';
  document.getElementById('revealPhoneBtn').disabled = true;
}

// Booking modal flow
const bookingModal = document.getElementById('bookingModal');
const stepPay = document.getElementById('stepPay');
const stepConfirm = document.getElementById('stepConfirm');

function openBooking(roomName, amount) {
  document.getElementById('modalRoomName').textContent = roomName;
  document.getElementById('modalAmount').textContent = 'KSh ' + amount.toLocaleString();
  stepPay.classList.remove('hidden');
  stepConfirm.classList.add('hidden');
  bookingModal.classList.add('open');
}

function closeBooking() {
  bookingModal.classList.remove('open');
}

function confirmPayment() {
  const applicantName = document.getElementById('applicantName') ? document.getElementById('applicantName').value : 'Grace Wanjiku';
  const applicantId = document.getElementById('applicantID') ? document.getElementById('applicantID').value : '29482710';
  const roomName = document.getElementById('modalRoomName') ? document.getElementById('modalRoomName').textContent : 'Unit A2';
  
  let amount = 12000;
  const amtText = document.getElementById('modalAmount') ? document.getElementById('modalAmount').textContent : '';
  const num = parseInt(amtText.replace(/[^0-9]/g, ''), 10);
  if (!isNaN(num)) amount = num;

  if (window.SynchroService) {
    const activeP = window._activeProperty || {
      id: 'PROP-NAI-001',
      name: 'Marigold Court',
      landlordId: 'LL-88201',
      landlordName: 'James M. (Landlord)',
      landlordPhone: '+254 712 345 678'
    };

    const hold = window.SynchroService.createEscrowHold({
      tenantName: applicantName,
      tenantPhone: '+254 700 ' + Math.floor(100000 + Math.random() * 900000),
      landlordId: activeP.landlordId || 'LL-88201',
      landlordName: activeP.landlordName || 'James M. (Landlord)',
      landlordPhone: activeP.landlordPhone || '+254 712 345 678',
      propertyId: activeP.id,
      propertyName: activeP.name,
      unitId: roomName,
      amountKES: amount,
      paymentChannel: 'M-Pesa Synchro Escrow (Paybill 400200)'
    });
    console.log('Created Synchro Escrow hold:', hold.id);
  }

  stepPay.classList.add('hidden');
  stepConfirm.classList.remove('hidden');
}

function loadRegisteredPropertyFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const propId = params.get('prop') || params.get('id');
  if (!propId || !window.SynchroService) return;

  const props = window.SynchroService.getProperties();
  const found = props.find(p => p.id === propId);
  if (!found) return;

  const titleEl = document.querySelector('.title-block h1');
  if (titleEl) titleEl.textContent = found.name;

  const locEl = document.querySelector('.location');
  if (locEl) locEl.innerHTML = '<i class="icon-pin" aria-hidden="true"></i> ' + found.location + (found.cadastralTitleNo ? ' · Title: ' + found.cadastralTitleNo : '');

  const mainImg = document.getElementById('mainImage');
  if (mainImg && found.imageUrl) mainImg.src = found.imageUrl;

  const descEl = document.querySelector('.about-block p');
  if (descEl && found.description) descEl.textContent = found.description;

  if (found.landlordPhone) window._ownerPhone = found.landlordPhone;

  // Set active property reference for escrow holding
  window._activeProperty = found;
}

loadRegisteredPropertyFromUrl();

bookingModal.addEventListener('click', (e) => {
  if (e.target === bookingModal) closeBooking();
});

// Reflect whatever the owner last saved in owner-dashboard.html — this only
// works within the same browser (localStorage is per-device, not a real
// database), but proves the owner-to-customer update flow end to end.
function applyOwnerData() {
  const bioRaw = localStorage.getItem('findaz_owner_bio');
  const paymentsRaw = localStorage.getItem('findaz_owner_payments');

  if (bioRaw) {
    const bio = JSON.parse(bioRaw);
    const aboutPara = document.querySelector('.about-block p');
    if (aboutPara && bio.bio) aboutPara.textContent = bio.bio;

    const titleEl = document.querySelector('.title-block h1');
    if (titleEl && bio.name) titleEl.textContent = bio.name;

    const locEl = document.querySelector('.location');
    if (locEl && bio.location) {
      locEl.innerHTML = '<i class="icon-pin" aria-hidden="true"></i> ' + bio.location;
    }

    if (bio.phone) {
      window._ownerPhone = bio.phone;
    }
  }

  if (paymentsRaw) {
    const payments = JSON.parse(paymentsRaw);
    const list = document.getElementById('paymentMethodsList');
    if (!list) return;

    const rows = [];
    if (payments.mpesa && payments.mpesa.enabled) {
      rows.push(['M-Pesa Paybill', payments.mpesa.paybill + ' · Acc: ' + payments.mpesa.account]);
    }
    if (payments.buygoods && payments.buygoods.enabled) {
      rows.push(['Buy Goods', 'Till ' + payments.buygoods.till]);
    }
    if (payments.pochi && payments.pochi.enabled) {
      rows.push(['Pochi la Biashara', payments.pochi.phone]);
    }
    if (payments.card && payments.card.enabled) {
      rows.push(['Card / Visa', 'Coming soon']);
    }

    if (rows.length) {
      list.innerHTML = rows.map(([name, detail]) =>
        '<div class="payment-method-item"><span class="pm-name">' + name +
        '</span><span class="pm-detail">' + detail + '</span></div>'
      ).join('');
    } else {
      list.innerHTML = '<p class="pm-detail">No payment methods set up yet.</p>';
    }
  }
}

applyOwnerData();
