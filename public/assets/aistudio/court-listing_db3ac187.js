// Gallery thumbnail switching
const thumbs = document.querySelectorAll(".thumb");
const mainImage = document.getElementById("mainImage");
const galleryCount = document.getElementById("galleryCount");
const totalImages = thumbs.length;

thumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    thumbs.forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");
    mainImage.src = thumb.src.replace("w=200&h=150", "w=900&h=600");
    galleryCount.textContent =
      parseInt(thumb.dataset.index) + 1 + " / " + totalImages;
  });
});

// Reveal phone number
function revealPhone() {
  document.getElementById("phoneNumber").textContent = "+254 733 221 456";
  document.getElementById("revealPhoneBtn").textContent = "Number revealed";
  document.getElementById("revealPhoneBtn").disabled = true;
}

// Booking modal flow
const bookingModal = document.getElementById("bookingModal");
const stepPay = document.getElementById("stepPay");
const stepConfirm = document.getElementById("stepConfirm");

function openBooking(roomName, amount) {
  document.getElementById("modalRoomName").textContent = roomName;
  document.getElementById("modalAmount").textContent =
    "KSh " + amount.toLocaleString();
  stepPay.classList.remove("hidden");
  stepConfirm.classList.add("hidden");
  bookingModal.classList.add("open");
}

function closeBooking() {
  bookingModal.classList.remove("open");
}

function confirmPayment() {
  stepPay.classList.add("hidden");
  stepConfirm.classList.remove("hidden");
}

bookingModal.addEventListener("click", (e) => {
  if (e.target === bookingModal) closeBooking();
});

// Note: unlike Marigold Court's listing.html, this page is not connected
// to the owner-dashboard demo (that dashboard represents one business —
// Marigold Court). Amani Court's contact and payment details are static
// for now until each business gets its own dashboard.
