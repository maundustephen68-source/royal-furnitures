/**
 * Royal Furniture — Main JavaScript (royal.js)
 * Full interactivity for all 4 pages
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     WHATSAPP FLOATING BUTTON (appears on every page)
     ============================================================ */
  const waNumber = '254716817495'; // Kenya +254 format
  const waDefault = 'Hello! I am interested in your furniture. Please assist me.';

  const waBtn = document.createElement('a');
  waBtn.classList.add('whatsapp-float');
  waBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waDefault)}`;
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  waBtn.innerHTML = `
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path fill="#fff" d="M23.5 8.5A10.44 10.44 0 0 0 16 5.5C10.2 5.5 5.5 10.2 5.5 16c0 1.86.49 3.67 1.42 5.26L5.5 26.5l5.36-1.41A10.46 10.46 0 0 0 16 26.5c5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.09-5.43-3.0-7.5zm-7.5 16.15c-1.58 0-3.13-.42-4.49-1.22l-.32-.19-3.18.83.85-3.1-.21-.33A8.67 8.67 0 0 1 7.32 16c0-4.78 3.9-8.68 8.68-8.68 2.32 0 4.5.9 6.13 2.55A8.61 8.61 0 0 1 24.68 16c0 4.78-3.9 8.65-8.68 8.65zm4.76-6.48c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.65.85-.8 1.02-.15.17-.3.19-.55.06-.26-.13-1.08-.4-2.06-1.27-.76-.68-1.27-1.52-1.42-1.77-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.92-.21-.5-.43-.43-.58-.44h-.5c-.17 0-.45.06-.68.32-.23.26-.89.87-.89 2.12s.91 2.46 1.04 2.63c.13.17 1.8 2.75 4.36 3.85.61.26 1.08.42 1.45.54.61.19 1.16.16 1.6.1.49-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.23-.17-.49-.3z"/>
    </svg>
  `;
  document.body.appendChild(waBtn);

  const waTooltip = document.createElement('div');
  waTooltip.classList.add('whatsapp-tooltip');
  waTooltip.textContent = '💬 Chat with us on WhatsApp';
  document.body.appendChild(waTooltip);

  // Pulse animation for WhatsApp button
  const pulseCss = document.createElement('style');
  pulseCss.textContent = `
    @keyframes waPulse {
      0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
      70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
      100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
    }
    .whatsapp-float { animation: waPulse 2.5s infinite; }
    .whatsapp-float:hover { animation: none; }
  `;
  document.head.appendChild(pulseCss);

  /* ============================================================
     MOBILE NAVIGATION TOGGLE
     ============================================================ */
  const nav = document.querySelector('nav');
  const header = document.querySelector('header');

  if (nav) {
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    hamburger.setAttribute('aria-label', 'Toggle Navigation');
    hamburger.innerHTML = `<span></span><span></span><span></span>`;
    // Place hamburger inside nav but absolutely positioned via CSS
    nav.style.position = 'relative';
    nav.appendChild(hamburger);

    hamburger.addEventListener('click', function () {
      nav.classList.toggle('nav-open');
      this.classList.toggle('active');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav-open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ============================================================
     ACTIVE NAV LINK HIGHLIGHTING
     ============================================================ */
  const currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'home.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href').toLowerCase();
    if (href === currentPage) link.classList.add('active-link');
  });

  /* ============================================================
     PAGE BANNER — click to change image (works on every page)
     ============================================================ */
  const pageBanner = document.querySelector('.page-banner');
  if (pageBanner) {
    // Upload hint label
    const hint = document.createElement('div');
    hint.classList.add('banner-upload-hint');
    hint.textContent = '📷 Click banner to change image';
    pageBanner.appendChild(hint);

    // Hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    pageBanner.style.cursor = 'pointer';
    pageBanner.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        pageBanner.style.backgroundImage = `url('${ev.target.result}')`;
        if (pageBanner.querySelector('::before')) pageBanner.style.backgroundImage = `url('${ev.target.result}')`;
        hint.textContent = '✅ Image updated! (Add the real filename to your HTML for it to save permanently)';
        hint.style.borderRadius = '8px';
        hint.style.padding = '6px 14px';
        setTimeout(() => { hint.style.display = 'none'; }, 5000);
        showToast('Banner image updated! 🖼️', 'success');
      };
      reader.readAsDataURL(file);
    });
  }

  /* ============================================================
     SCROLL-REVEAL ANIMATION
     ============================================================ */
  const revealEls = document.querySelectorAll('.section, .card, .page-banner');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 0.1}s`;
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  const topBtn = document.createElement('button');
  topBtn.classList.add('back-to-top');
  topBtn.innerHTML = '&#9650;';
  topBtn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 300);
  });
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ============================================================
     TOAST NOTIFICATION SYSTEM
     ============================================================ */
  function showToast(msg, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.classList.add('toast-container');
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.classList.add('toast', `toast-${type}`);
    t.textContent = msg;
    container.appendChild(t);
    requestAnimationFrame(() => t.classList.add('toast-visible'));
    setTimeout(() => {
      t.classList.remove('toast-visible');
      setTimeout(() => t.remove(), 400);
    }, 3800);
  }

  /* ============================================================
     PRODUCTS PAGE
     ============================================================ */
  if (document.querySelector('.products')) {

    // ---- Cart State ----
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('royalCart') || '[]'); } catch(e) { cart = []; }

    // ---- Cart Icon in Header ----
    if (header) {
      const cartIcon = document.createElement('div');
      cartIcon.classList.add('cart-icon');
      cartIcon.innerHTML = `🛒 Cart <span class="cart-count">0</span>`;
      header.appendChild(cartIcon);
      cartIcon.addEventListener('click', openCart);
    }

    function updateCartCount() {
      const count = cart.reduce((s, i) => s + i.qty, 0);
      const el = document.querySelector('.cart-count');
      if (el) el.textContent = count;
    }
    updateCartCount();

    function saveCart() {
      try { localStorage.setItem('royalCart', JSON.stringify(cart)); } catch(e){}
    }

    // ---- Cart Sidebar ----
    const cartSidebar = document.createElement('div');
    cartSidebar.classList.add('cart-sidebar');
    cartSidebar.innerHTML = `
      <div class="cart-sidebar-header">
        <h3>🛒 Your Cart</h3>
        <button class="close-cart" aria-label="Close cart">✕</button>
      </div>
      <div class="cart-items"></div>
      <div class="cart-footer">
        <div class="cart-total">Total: <strong>$0</strong></div>
        <button class="checkout-btn">✓ Checkout via WhatsApp</button>
        <button class="clear-cart-btn">Clear Cart</button>
      </div>
    `;
    document.body.appendChild(cartSidebar);

    const overlay = document.createElement('div');
    overlay.classList.add('cart-overlay');
    document.body.appendChild(overlay);

    function openCart()  { cartSidebar.classList.add('open'); overlay.classList.add('open'); renderCart(); }
    function closeCart() { cartSidebar.classList.remove('open'); overlay.classList.remove('open'); }

    cartSidebar.querySelector('.close-cart').addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);

    function renderCart() {
      const container = cartSidebar.querySelector('.cart-items');
      if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">🛒 Your cart is empty.<br><small>Browse products and add items!</small></p>';
        cartSidebar.querySelector('.cart-total strong').textContent = '$0';
        return;
      }
      container.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <strong>${item.name}</strong>
            <small>$${item.price.toLocaleString()} × ${item.qty} = $${(item.price * item.qty).toLocaleString()}</small>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-index="${i}" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-index="${i}" aria-label="Increase">+</button>
            <button class="remove-btn" data-index="${i}" aria-label="Remove">🗑</button>
          </div>
        </div>
      `).join('');

      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      cartSidebar.querySelector('.cart-total strong').textContent = `$${total.toLocaleString()}`;

      container.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          const idx = +this.dataset.index;
          if (this.dataset.action === 'inc') cart[idx].qty++;
          else cart[idx].qty--;
          if (cart[idx].qty <= 0) cart.splice(idx, 1);
          saveCart(); renderCart(); updateCartCount();
        });
      });
      container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          cart.splice(+this.dataset.index, 1);
          saveCart(); renderCart(); updateCartCount();
        });
      });
    }

    cartSidebar.querySelector('.clear-cart-btn').addEventListener('click', () => {
      if (!cart.length) return;
      cart = []; saveCart(); renderCart(); updateCartCount();
      showToast('Cart cleared.', 'error');
    });

    // WhatsApp checkout — saves order to Firebase if logged in
    cartSidebar.querySelector('.checkout-btn').addEventListener('click', async () => {
      if (!cart.length) { showToast('Your cart is empty!', 'error'); return; }
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const lines = cart.map(i => `• ${i.name} x${i.qty} = $${(i.price * i.qty).toLocaleString()}`).join('\n');

      // Save order to Firebase if user is logged in
      let orderId = 'RF-' + Date.now();
      try {
        if (typeof rfSaveOrder === 'function') {
          orderId = await rfSaveOrder({ items: cart, total });
          showToast(`Order ${orderId} saved! Opening WhatsApp…`, 'success');
        }
      } catch (e) {
        // Not logged in or Firebase not set up — still open WhatsApp
      }

      const msg = `Hello Royal Furniture! I would like to order:\n\nOrder ID: ${orderId}\n\n${lines}\n\nTotal: $${total.toLocaleString()}\n\nPlease confirm availability and delivery.`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      cart = []; saveCart(); renderCart(); updateCartCount(); closeCart();
    });

    // ---- Product Modal ----
    const modal = document.createElement('div');
    modal.classList.add('product-modal');
    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-modal" aria-label="Close">✕</button>
        <img class="modal-img" src="" alt="">
        <div class="modal-body">
          <h2 class="modal-title"></h2>
          <p class="modal-desc"></p>
          <div class="modal-price"></div>
          <div class="modal-qty">
            <button class="modal-dec" aria-label="Decrease">−</button>
            <span class="modal-qty-val">1</span>
            <button class="modal-inc" aria-label="Increase">+</button>
          </div>
          <button class="modal-add-btn">🛒 Add to Cart</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    let currentProduct = null;
    let currentQty = 1;

    modal.querySelector('.close-modal').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

    modal.querySelector('.modal-dec').addEventListener('click', () => {
      if (currentQty > 1) { currentQty--; modal.querySelector('.modal-qty-val').textContent = currentQty; }
    });
    modal.querySelector('.modal-inc').addEventListener('click', () => {
      currentQty++; modal.querySelector('.modal-qty-val').textContent = currentQty;
    });

    modal.querySelector('.modal-add-btn').addEventListener('click', () => {
      if (!currentProduct) return;
      const existing = cart.find(i => i.name === currentProduct.name);
      if (existing) existing.qty += currentQty;
      else cart.push({ ...currentProduct, qty: currentQty });
      saveCart(); updateCartCount();
      modal.classList.remove('open');
      showToast(`"${currentProduct.name}" added to cart! 🛒`, 'success');
    });

    // Wire "View Product" buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.card');
        const name  = card.querySelector('h3').textContent;
        const desc  = card.querySelector('p').textContent;
        const priceText = card.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const imgSrc = card.querySelector('img').src;

        currentProduct = { name, price };
        currentQty = 1;

        modal.querySelector('.modal-img').src = imgSrc;
        modal.querySelector('.modal-img').alt = name;
        modal.querySelector('.modal-title').textContent = name;
        modal.querySelector('.modal-desc').textContent = desc;
        modal.querySelector('.modal-price').textContent = priceText;
        modal.querySelector('.modal-qty-val').textContent = '1';
        modal.classList.add('open');
      });
    });

    // ---- Category Filter Tabs ----
    const categoryTitles = document.querySelectorAll('.category-title');
    if (categoryTitles.length > 0) {
      const filterBar = document.createElement('div');
      filterBar.classList.add('filter-bar');

      const allBtn = document.createElement('button');
      allBtn.textContent = 'All';
      allBtn.classList.add('filter-btn', 'active');
      filterBar.appendChild(allBtn);

      categoryTitles.forEach(title => {
        const name = title.textContent.replace(' Collection', '').trim();
        const btn  = document.createElement('button');
        btn.textContent = name;
        btn.classList.add('filter-btn');
        btn.dataset.category = name;
        filterBar.appendChild(btn);
      });

      const banner = document.querySelector('.page-banner');
      if (banner) banner.after(filterBar);

      filterBar.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          const sel = this.textContent;

          categoryTitles.forEach(title => {
            const grid = title.nextElementSibling;
            const match = sel === 'All' || title.textContent.includes(sel);
            title.style.display = match ? '' : 'none';
            if (grid) grid.style.display = match ? '' : 'none';
          });

          // Reset search
          const searchInput = document.querySelector('.product-search');
          if (searchInput) searchInput.value = '';
          document.querySelectorAll('.card').forEach(c => c.style.display = '');
        });
      });
    }

    // ---- Product Search Bar ----
    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('search-bar-wrapper');
    searchWrapper.innerHTML = `<input type="text" class="product-search" placeholder="🔍  Search products..." aria-label="Search products">`;
    const filterBarEl = document.querySelector('.filter-bar');
    if (filterBarEl) filterBarEl.after(searchWrapper);

    searchWrapper.querySelector('.product-search').addEventListener('input', function () {
      const q = this.value.toLowerCase();
      // Show all categories first
      document.querySelectorAll('.category-title, .products').forEach(el => el.style.display = '');
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.filter-btn').classList.add('active');

      document.querySelectorAll('.card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();
        card.style.display = (name.includes(q) || desc.includes(q)) ? '' : 'none';
      });
    });

  } // end products page

  /* ============================================================
     CONTACT PAGE FORM VALIDATION
     ============================================================ */
  const contactForm = document.querySelector('form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput  = this.querySelector('input[type="text"]');
      const emailInput = this.querySelector('input[type="email"]');
      const msgInput   = this.querySelector('textarea');

      // Clear old errors
      this.querySelectorAll('.field-error').forEach(el => el.remove());
      this.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-error'));

      let valid = true;
      function showError(input, message) {
        input.classList.add('input-error');
        const err = document.createElement('span');
        err.classList.add('field-error');
        err.textContent = message;
        input.insertAdjacentElement('afterend', err);
        valid = false;
      }

      if (!nameInput || !nameInput.value.trim())
        showError(nameInput, '⚠ Please enter your full name.');
      if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value))
        showError(emailInput, '⚠ Please enter a valid email address.');
      if (!msgInput || msgInput.value.trim().length < 10)
        showError(msgInput, '⚠ Message must be at least 10 characters.');

      if (!valid) return;

      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('✅ Message sent! We will contact you shortly.', 'success');
        contactForm.reset();
        const counter = document.querySelector('.char-counter');
        if (counter) counter.textContent = '0 characters';
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1600);
    });

    // WhatsApp quick contact link in contact form area
    const waLink = document.createElement('p');
    waLink.style.cssText = 'margin-top:20px;text-align:center;font-size:14px;color:#555;';
    waLink.innerHTML = `Or message us directly on 
      <a href="https://wa.me/${waNumber}?text=${encodeURIComponent('Hello Royal Furniture! I would like more information.')}" 
         target="_blank" rel="noopener" 
         style="color:#25D366;font-weight:700;text-decoration:underline;">
        WhatsApp: +254 716 817 495
      </a>`;
    contactForm.after(waLink);

    // Live character counter
    const textarea = contactForm.querySelector('textarea');
    if (textarea) {
      const counter = document.createElement('small');
      counter.classList.add('char-counter');
      counter.textContent = '0 characters';
      textarea.insertAdjacentElement('afterend', counter);
      textarea.addEventListener('input', function () {
        const len = this.value.length;
        counter.textContent = `${len} character${len !== 1 ? 's' : ''}`;
        counter.style.color = len < 10 ? '#c0392b' : '#aaa';
      });
    }
  }

}); // end DOMContentLoaded
