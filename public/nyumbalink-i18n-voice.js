/**
 * nyumbalink-i18n-voice.js
 * Comprehensive Bilingual Translation Dictionary (English <-> Swahili)
 * and Voice Input Engine (Web Speech API) across the entire NyumbaLink platform.
 */

(function () {
  const LANG_STORAGE_KEY = 'nyumbalink_language';

  // Complete English and Swahili Translation Matrix
  const TRANSLATIONS = {
    en: {
      // Header & Navigation
      'search_placeholder': 'Search apartments, rental houses, bedsitters, courts...',
      'sign_in': 'Sign in',
      'sign_out': 'Sign out',
      'back': 'Back',
      'staff_login': 'Staff Login',
      'home': 'Home',
      'apartments': 'Apartments',
      'courts': 'Courts',
      'rental_houses': 'Rental houses',
      'bedsitters': 'Bedsitters',
      
      // Hero & Tagline
      'hero_eyebrow': "Africa's everyday rentals marketplace",
      'hero_title': "Search affordable homes from Africa to the world",
      'hero_sub': 'Apartments, courts, rental houses, and bedsitters — all in one place, priced in the open.',
      
      // Sections & Cards
      'priced_in_open': 'Priced in the open',
      'priced_in_open_sub': 'No hidden fees, no back-and-forth — see real vacancies and monthly rates up front.',
      'month': '/month',
      'vacant': 'vacant',
      'vacant_units': 'vacant units',
      'occupied_units': 'occupied units',
      'total_units': 'total units',
      'structural_grade': 'structural grade',
      'from': 'from',
      'book': 'Book',
      'apply_book': 'Apply & Book',
      'unavailable': 'Unavailable',
      
      // Reviews & Marquee
      'people_finding_place': 'People finding their place',
      'reviews_sub': 'Verified tenants share their rental search experience.',
      'tenants_registered': 'tenants registered',
      'property_listings': 'property listings',
      'cta_title': 'List your property. Set your rent. Get found.',
      'cta_sub': "Whether it's an apartment, court unit, rental house, or bedsitter — get on NyumbaLink in minutes.",
      'get_started': 'Get started',
      'footer_tagline': 'NyumbaLink · Search affordable life, from Africa to the world',

      // Map & Geolocation
      'find_vacant_near_me': 'Find Vacant Houses Near Me',
      'locating_gps': 'Locating your GPS...',
      'nearest_vacant': 'Nearest vacant house',
      'location_set': 'Position Located (Nearest Ranked)',

      // Voice
      'listening_voice': 'Listening... Speak your search (English or Swahili)',
      'voice_not_supported': 'Voice search is not supported in this browser.',
      'voice_mic_label': 'Voice search input'
    },
    sw: {
      // Header & Navigation
      'search_placeholder': 'Tafuta ghorofa, nyumba za kupanga, bedsitters, koti...',
      'sign_in': 'Ingia',
      'sign_out': 'Ondoka',
      'back': 'Rudi',
      'staff_login': 'Kuingia kwa Wasimamizi',
      'home': 'Nyumbani',
      'apartments': 'Ghorofa / Apartments',
      'courts': 'Koti / Courts',
      'rental_houses': 'Nyumba za Kupanga',
      'bedsitters': 'Bedsitters',
      
      // Hero & Tagline
      'hero_eyebrow': 'Soko la kila siku la nyumba za kupanga Afrika',
      'hero_title': 'Tafuta makazi nafuu kutoka Afrika kote ulimwenguni',
      'hero_sub': 'Ghorofa, koti, nyumba za familia, na vyumba vya bedsitter — vyote sehemu moja kwa bei wazi.',
      
      // Sections & Cards
      'priced_in_open': 'Bei wazi bila kuficha',
      'priced_in_open_sub': 'Hakuna ada zilizofichwa wala udalali — angalia vyumba vilivyo wazi na bei kamili kabla ya kupiga simu.',
      'month': '/mwezi',
      'vacant': 'wazi',
      'vacant_units': 'vyumba vilivyo wazi',
      'occupied_units': 'vyumba vilivyokaliwa',
      'total_units': 'jumla ya vyumba',
      'structural_grade': 'ubora wa jengo',
      'from': 'kuanzia',
      'book': 'Hifadhi',
      'apply_book': 'Omba na Hifadhi',
      'unavailable': 'Imeshachukuliwa',
      
      // Reviews & Marquee
      'people_finding_place': 'Watu wakipata makazi yao',
      'reviews_sub': 'Wapangaji halisi wanaoshiriki uzoefu wao wa kupata nyumba.',
      'tenants_registered': 'wapangaji waliosajiliwa',
      'property_listings': 'nyumba zilizoorodheshwa',
      'cta_title': 'Orodhesha nyumba yako. Weka kodi yako. Patikana.',
      'cta_sub': 'Iwe ni ghorofa, koti, nyumba ya kujitegemea, au bedsitter — jiunge na NyumbaLink kwa dakika chache.',
      'get_started': 'Anza sasa',
      'footer_tagline': 'NyumbaLink · Tafuta maisha ya gharama nafuu, kutoka Afrika hadi duniani',

      // Map & Geolocation
      'find_vacant_near_me': 'Tafuta Nyumba Zilizo Wazi Karibu Nami',
      'locating_gps': 'Inatafuta eneo lako kwa GPS...',
      'nearest_vacant': 'Nyumba wazi iliyo karibu zaidi',
      'location_set': 'Eneo Limepatikana (Zilizopangwa kwa Ukaribu)',

      // Voice
      'listening_voice': 'Inasikiliza... Sema unachotafuta (Kiswahili au Kiingereza)',
      'voice_not_supported': 'Utafutaji wa sauti hauwezekani kwenye kivinjari hiki.',
      'voice_mic_label': 'Tafuta kwa sauti'
    }
  };

  // Get current language from localStorage or default to 'en'
  function getCurrentLanguage() {
    return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
  }

  // Set Language globally and update DOM
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'sw') lang = 'en';
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    // Update active pill state in all switchers
    document.querySelectorAll('.lang-btn-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    applyTranslations(lang);
  }

  function applyTranslations(lang) {
    const cur = lang || getCurrentLanguage();
    const t = TRANSLATIONS[cur] || TRANSLATIONS.en;

    // 1. Update elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    // 2. Update search inputs placeholder
    document.querySelectorAll('form.search-bar input').forEach(input => {
      input.placeholder = t['search_placeholder'];
    });

    // 3. Update category buttons in hero
    const categoryMap = {
      'apartments': t['apartments'],
      'courts': t['courts'],
      'rentals': t['rental_houses'],
      'bedsitters': t['bedsitters']
    };
    document.querySelectorAll('.tab.fx-liquid').forEach(tab => {
      const cat = tab.dataset.cat;
      if (categoryMap[cat]) {
        tab.textContent = categoryMap[cat];
      }
    });

    // 4. Update Map Locate Button if present
    const locateBtn = document.getElementById('locateMeBtn');
    if (locateBtn) {
      const span = locateBtn.querySelector('span');
      if (span && !locateBtn.dataset.located) {
        span.textContent = t['find_vacant_near_me'];
      }
    }

    // 5. Update Map Overlay Label
    const mapOverlayLabel = document.querySelector('.map-overlay-label');
    if (mapOverlayLabel) {
      mapOverlayLabel.textContent = t['nearest_vacant'];
    }

    // 6. Update Sign-in / Sign-out buttons in header based on actual authentication state
    const authUserRaw = localStorage.getItem('findaz_auth_user');
    let loggedInUser = null;
    if (authUserRaw) {
      try { loggedInUser = JSON.parse(authUserRaw); } catch(e){}
    }

    document.querySelectorAll('.site-header .btn-ghost').forEach(btn => {
      // Don't modify the "Marketplace" button or other navigational links
      if (btn.textContent.includes('Marketplace') || btn.textContent.includes('Soko')) return;

      const isSignoutAction = btn.id === 'signoutBtn' || 
                              btn.getAttribute('data-action') === 'signout' || 
                              btn.textContent.toLowerCase().includes('sign out') || 
                              btn.textContent.toLowerCase().includes('ondoka');

      if (isSignoutAction) {
        btn.textContent = t['sign_out'] || 'Sign out';
        btn.href = 'signin.html';
        btn.onclick = (e) => {
          localStorage.removeItem('findaz_auth_user');
          localStorage.removeItem('findaz_admin_access');
        };
      } else if (loggedInUser) {
        // User is logged in: show appropriate destination instead of "Sign in"
        if (loggedInUser.role === 'landlord') {
          btn.textContent = (cur === 'sw' ? 'Mwenye Nyumba' : 'Landlord Hub');
          btn.href = 'owner-dashboard.html';
        } else if (loggedInUser.role === 'admin') {
          btn.textContent = 'Admin Command';
          btn.href = 'admin.html';
        } else {
          btn.textContent = (cur === 'sw' ? 'Akaunti Yangu' : 'My Account');
          btn.href = 'account.html?type=customer';
        }
      } else {
        // User is not logged in
        if (btn.href && btn.href.includes('signin.html')) {
          btn.textContent = t['sign_in'] || 'Sign in';
        }
      }
    });

    // 7. Update Footer Tagline
    const footerP = document.querySelector('.site-footer p');
    if (footerP) {
      const staffLink = footerP.querySelector('a');
      footerP.innerHTML = `${t['footer_tagline']}` + (staffLink ? ` · <a href="${staffLink.href}" style="opacity:0.4; font-size:0.7rem;">${t['staff_login']}</a>` : '');
    }
  }

  // Inject language switcher and voice search button dynamically
  function enhanceUIWithVoiceAndLanguage() {
    // 1. Enhance all search forms with a Voice Input Microphone Button
    document.querySelectorAll('form.search-bar').forEach(form => {
      if (form.querySelector('.voice-search-btn')) return;

      const micBtn = document.createElement('button');
      micBtn.type = 'button';
      micBtn.className = 'voice-search-btn';
      micBtn.setAttribute('aria-label', 'Voice search input');
      micBtn.title = 'Click to speak (Voice input / Tafuta kwa sauti)';
      micBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      `;

      micBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerVoiceSearch(form, micBtn);
      });

      form.appendChild(micBtn);
    });

    // 2. Enhance Header with Global English <-> Swahili Switcher
    document.querySelectorAll('.site-header .header-inner').forEach(header => {
      if (header.querySelector('.lang-switcher-global')) return;

      const switcher = document.createElement('div');
      switcher.className = 'lang-switcher-global';
      switcher.setAttribute('aria-label', 'Select language');
      const cur = getCurrentLanguage();

      switcher.innerHTML = `
        <button type="button" class="lang-btn-pill ${cur === 'en' ? 'active' : ''}" data-lang="en">EN</button>
        <button type="button" class="lang-btn-pill ${cur === 'sw' ? 'active' : ''}" data-lang="sw">SW</button>
      `;

      switcher.querySelectorAll('.lang-btn-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          setLanguage(btn.dataset.lang);
        });
      });

      // Safely locate direct child of header to insert switcher before
      const signinBtn = header.querySelector('.btn-ghost') || header.lastElementChild;
      let targetChild = null;
      if (signinBtn) {
        for (let i = 0; i < header.children.length; i++) {
          if (header.children[i] === signinBtn || header.children[i].contains(signinBtn)) {
            targetChild = header.children[i];
            break;
          }
        }
      }

      if (targetChild && targetChild.parentNode === header) {
        header.insertBefore(switcher, targetChild);
      } else {
        header.appendChild(switcher);
      }
    });

    // 3. Create Voice Status Floating Toast if not present
    if (!document.getElementById('voiceStatusToast')) {
      const toast = document.createElement('div');
      toast.id = 'voiceStatusToast';
      toast.className = 'voice-status-toast';
      toast.innerHTML = `<span class="voice-wave-dot"></span><span id="voiceToastText">Listening...</span>`;
      document.body.appendChild(toast);
    }
  }

  // Voice Recognition Engine using HTML5 Web Speech API with Swahili & English Fallback
  let recognition = null;
  function triggerVoiceSearch(form, micBtn) {
    const input = form.querySelector('input');
    const toast = document.getElementById('voiceStatusToast');
    const toastText = document.getElementById('voiceToastText');
    const currentLang = getCurrentLanguage();
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t['voice_not_supported']);
      return;
    }

    if (recognition) {
      try { recognition.stop(); } catch(e){}
    }

    recognition = new SpeechRecognition();
    // Swahili (Kenya) or English (Kenya/US) based on current selected language
    recognition.lang = currentLang === 'sw' ? 'sw-KE' : 'en-KE';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 2;

    micBtn.classList.add('listening');
    if (toast) {
      toastText.textContent = t['listening_voice'];
      toast.classList.add('show');
    }

    recognition.onresult = function (event) {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      if (input) input.value = transcript;
    };

    recognition.onerror = function (event) {
      micBtn.classList.remove('listening');
      if (toast) toast.classList.remove('show');
    };

    recognition.onend = function () {
      micBtn.classList.remove('listening');
      if (toast) toast.classList.remove('show');

      // Auto-submit search if voice input was captured
      if (input && input.value.trim().length > 1) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    };

    recognition.start();
  }

  // Export functions to window
  window.NyumbaLinkI18n = {
    setLanguage: setLanguage,
    getLanguage: getCurrentLanguage,
    translations: TRANSLATIONS
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enhanceUIWithVoiceAndLanguage();
      setLanguage(getCurrentLanguage());
    });
  } else {
    enhanceUIWithVoiceAndLanguage();
    setLanguage(getCurrentLanguage());
  }
})();
