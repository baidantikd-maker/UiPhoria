document.addEventListener('DOMContentLoaded', () => {
  
  /* ═══════════════════════════════════════ NAVIGATION ═══════════════════════════════════════ */
  
  const header = document.getElementById('nav-header');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  
  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile Menu Toggle
  const toggleMenu = () => {
    const isOpen = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
    document.body.style.overflow = isOpen ? '' : 'hidden';
    
    hamburger.querySelectorAll('span').forEach((span, index) => {
      if (!isOpen) {
        if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        span.style.transform = 'none';
        span.style.opacity = '1';
      }
    });
  };

  hamburger.addEventListener('click', toggleMenu);
  
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.style.display === 'flex') {
        toggleMenu();
      }
    });
  });

  /* ═══════════════════════════════════════ SCROLL REVEAL ══════════════════════════════════════ */
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply reveal to sections and cards
  const revealElements = document.querySelectorAll('section, .cap-item, .phil-card, .journal-card, .journal-list-item');
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.2, 1, 0.3, 1)';
    revealObserver.observe(el);
  });

  // CSS injection for reveal
  const style = document.createElement('style');
  style.textContent = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  /* ═══════════════════════════════════════ STATS COUNTER ══════════════════════════════════════ */
  
  const stats = document.querySelectorAll('.stat-value');
  
  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();
    
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * (target - start) + start);
      
      el.textContent = currentCount;
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target;
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));

  /* ═══════════════════════════════════════ FORM HANDLING ══════════════════════════════════════ */
  
  const ctaForm = document.getElementById('cta-form');
  const submitBtn = document.getElementById('form-submit-btn');
  
  ctaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple visual feedback
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.innerHTML = 'Request received ✓';
      submitBtn.style.background = '#10B981';
      submitBtn.style.color = '#fff';
      ctaForm.reset();
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 3000);
    }, 1500);
  });

  /* ═══════════════════════════════════════ PARALLAX HERO ═════════════════════════════════════ */
  
  const dashboard = document.getElementById('hero-dashboard');
  if (dashboard) {
    window.addEventListener('scroll', () => {
      const speed = 0.05;
      const yPos = -(window.scrollY * speed);
      dashboard.style.transform = `translateY(${yPos}px)`;
    });
  }

  /* ═══════════════════════════════════════ WISHLIST ══════════════════════════════════════ */
  
  const productData = {
    "gaming-mouse":   { name: "Gaming Mouse",     price: 4500.00,  image: "mouse.jpg", badge: "Gaming" },
    "bass-headphones":{ name: "Bass Headphones",   price: 12000.00, image: "jb.jpg",    badge: "Audio" },
    "gaming-keyboard":{ name: "Gaming Keyboard",   price: 6500.00,  image: "rgb.jpg",   badge: "Gaming" },
    "gaming-monitor": { name: "Gaming Monitor",    price: 8400.00,  image: "gm.jpg",    badge: "Gaming" },
    "quantum-compute":{ name: "Smart Watch",         price: 3500.00,  image: "sm.jpg",   badge: "Wearable" },
    "biomod":         { name: "Gaming CPU",         price: 18000.00, image: "cpu.jpg",   badge: "Hardware" }
  };

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
    catch { return []; }
  }

  function setWishlist(list) {
    localStorage.setItem('wishlist', JSON.stringify(list));
    document.querySelectorAll('.btn-wishlist').forEach(btn => syncBtn(btn));
  }

  function toggleWishlist(id) {
    const list = getWishlist();
    const idx = list.indexOf(id);
    if (idx === -1) list.push(id); else list.splice(idx, 1);
    setWishlist(list);
  }

  function isWishlisted(id) {
    return getWishlist().includes(id);
  }

  function syncBtn(btn) {
    const card = btn.closest('.product-card');
    if (!card) return;
    const id = card.dataset.productId;
    if (!id) return;
    const active = isWishlisted(id);
    const svg = btn.querySelector('svg');
    if (active) {
      btn.style.background = 'rgba(255,75,75,0.15)';
      btn.style.borderColor = '#FF4B4B';
      if (svg) { svg.style.fill = '#FF4B4B'; svg.style.stroke = '#FF4B4B'; }
      btn.innerHTML = (svg ? svg.outerHTML : '') + ' WISHLISTED';
    } else {
      btn.style.background = 'transparent';
      btn.style.borderColor = '#ff69b4';
      if (svg) { svg.style.fill = 'none'; svg.style.stroke = 'currentColor'; }
      btn.innerHTML = (svg ? svg.outerHTML : '') + ' WISHLIST';
    }
    btn.style.justifyContent = 'center';
    btn.style.gap = '6px';
  }

  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    syncBtn(btn);
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const card = this.closest('.product-card');
      if (!card) return;
      const id = card.dataset.productId;
      if (!id) return;
      toggleWishlist(id);
    });
  });

  /* ═══════════════════════════════════════ FILTERS ══════════════════════════════════════ */

  function applyFilters() {
    const search = (document.getElementById('filter-search').value || '').toLowerCase();
    const category = document.getElementById('filter-category').value;
    const priceRange = document.getElementById('filter-price').value;
    const rating = parseFloat(document.getElementById('filter-rating').value) || 0;

    document.querySelectorAll('.product-card').forEach(card => {
      const id = card.dataset.productId;
      const p = productData[id];
      if (!p) { card.style.display = 'flex'; return; }

      const matchSearch = !search || p.name.toLowerCase().includes(search);
      const matchCategory = !category || p.badge === category;

      let matchPrice = true;
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        matchPrice = p.price >= min && p.price <= max;
      }

      const ratingText = card.querySelector('.product-rating')?.textContent || '';
      const cardRating = parseFloat(ratingText.replace('★', '')) || 0;
      const matchRating = cardRating >= rating;

      card.style.display = (matchSearch && matchCategory && matchPrice && matchRating) ? 'flex' : 'none';
    });
  }

  const filterIds = ['filter-search', 'filter-category', 'filter-price', 'filter-rating'];
  filterIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', applyFilters);
  });

});
