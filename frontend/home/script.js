/* ───── Hero Carousel (robusto) ─────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const slides = [...document.querySelectorAll('.hero-carousel img')];
    const placeholders = [...document.querySelectorAll('.hero-placeholder')];
    const indicators = [...document.querySelectorAll('.indicator')];
  
    slides.forEach(img => img.addEventListener('error', () => img.style.display = 'none'));
  
    const activeSet = slides.some(img => img.complete && img.naturalWidth) ? slides : placeholders;
  
    let current = 0;
    function showSlide(idx) {
      activeSet[current].classList.remove('active');
      indicators[current].classList.remove('active');
      current = (idx + activeSet.length) % activeSet.length;
      activeSet[current].classList.add('active');
      indicators[current].classList.add('active');
    }
  
    activeSet[current].classList.add('active');
    indicators[current].classList.add('active');
  
    let timer = setInterval(() => showSlide(current + 1), 5000);
  
    window.goToSlide = idx => {
      showSlide(idx);
      clearInterval(timer);
      timer = setInterval(() => showSlide(current + 1), 5000);
    };
  });
  
  /* ───── Modal ──────────────────────────────── */
  function openModal(type) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const nameGrp = document.getElementById('name-group');
    const phoneGrp = document.getElementById('phone-group');
  
    if (type === 'login') {
      title.textContent = 'Iniciar Sesión';
      nameGrp.style.display = 'none';
      phoneGrp.style.display = 'none';
    } else {
      title.textContent = 'Registrarse';
      nameGrp.style.display = 'block';
      phoneGrp.style.display = 'block';
    }
  
    modal.style.display = 'block';
  }
  
  function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal-form').reset();
  }
  
  window.onclick = e => {
    if (e.target === document.getElementById('modal')) closeModal();
  };
  
  document.getElementById('modal-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('Funcionalidad en desarrollo');
    closeModal();
  });
  
  /* ───── Carruseles Horizontales Servicios ──── */
  function scrollCarousel(id, dir) {
    const c = document.getElementById(id);
    const amt = 270;
    c.scrollBy({ left: dir * amt, behavior: 'smooth' });
  }
  
  /* ───── Selección de Servicio ──────────────── */
  function selectService(card) {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    alert('Servicio seleccionado. Funcionalidad en desarrollo.');
  }
  
  /* ───── Scroll Suave en Navegación ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );
  