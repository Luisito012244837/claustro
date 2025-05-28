// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const header = document.querySelector('.header');
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (nav.classList.contains('open')) {
          menuToggle.classList.remove('open');
          nav.classList.remove('open');
          document.body.style.overflow = 'auto';
        }
      }
    });
  });
  
  // Initialize animations when elements come into view
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-up');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
  
  // Form validation for contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const nameInput = this.querySelector('input[name="name"]');
      const emailInput = this.querySelector('input[name="email"]');
      const dateInput = this.querySelector('input[name="date"]');
      const timeInput = this.querySelector('input[name="time"]');
      let isValid = true;
      
      // Simple validation
      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        isValid = false;
      } else {
        nameInput.classList.remove('error');
      }
      
      if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
        emailInput.classList.add('error');
        isValid = false;
      } else {
        emailInput.classList.remove('error');
      }
      
      if (!dateInput.value) {
        dateInput.classList.add('error');
        isValid = false;
      } else {
        dateInput.classList.remove('error');
      }
      
      if (!timeInput.value) {
        timeInput.classList.add('error');
        isValid = false;
      } else {
        timeInput.classList.remove('error');
      }
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  }
  
  // Gallery modal functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.querySelector('.modal');
  const modalContent = document.querySelector('.modal-content img');
  const closeBtn = document.querySelector('.close-btn');
  
  if (galleryItems.length && modal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        modalContent.src = imgSrc;
        modal.style.display = 'flex';
      });
    });
    
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  }