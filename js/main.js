// ==========================================
// WEBCOM - Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initTerminalAnimation();
  initSmoothScroll();
  initFormHandling();
});

// ==========================================
// NAVBAR
// ==========================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ==========================================
// MOBILE MENU
// ==========================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
  
  // Close menu when clicking on a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all animated elements
  const animatedElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-children'
  );
  
  animatedElements.forEach(el => observer.observe(el));
}

// ==========================================
// TERMINAL ANIMATION
// ==========================================
function initTerminalAnimation() {
  const terminalLines = document.querySelectorAll('.terminal-line');
  
  if (terminalLines.length === 0) return;
  
  // Terminal typing effect (optional enhancement)
  // The CSS animations handle the basic fade-in effect
}

// ==========================================
// SMOOTH SCROLL
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================
// FORM HANDLING
// ==========================================
function initFormHandling() {
  const contactForm = document.querySelector('.contact-form form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    // Basic validation before submitting
    let isValid = true;
    const requiredFields = this.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ff5f56';
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (!isValid) {
      e.preventDefault();
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    // Email validation
    const emailField = this.querySelector('input[type="email"]');
    if (emailField && !isValidEmail(emailField.value)) {
      e.preventDefault();
      showNotification('Please enter a valid email address.', 'error');
      emailField.style.borderColor = '#ff5f56';
      return;
    }
    
    // Show sending state (form will submit naturally to Formspree)
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Form will submit to Formspree and redirect to thank-you page
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#27ca40' : type === 'error' ? '#ff5f56' : '#00e5cc'};
    color: #050508;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 16px;
    font-weight: 500;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  // Add animation keyframes
  if (!document.querySelector('#notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }
  
  document.body.appendChild(notification);
  
  // Close button functionality
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// ==========================================
// COUNTER ANIMATION (for stats)
// ==========================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    
    element.textContent = current + '+';
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// Initialize counter animation when stats are visible
function initCounterAnimations() {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumber = entry.target.querySelector('h3');
        if (statNumber && !statNumber.dataset.animated) {
          const target = parseInt(statNumber.textContent);
          if (!isNaN(target)) {
            statNumber.dataset.animated = 'true';
            animateCounter(statNumber, target);
          }
        }
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
  });
}

// Run counter animations
document.addEventListener('DOMContentLoaded', initCounterAnimations);

// ==========================================
// PARALLAX EFFECT (subtle)
// ==========================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

document.addEventListener('DOMContentLoaded', initParallax);
