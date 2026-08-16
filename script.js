/**
 * Sachin Verma — Portfolio Interactive Scripts
 * Features:
 * 1. Interactive HTML5 Canvas Spider-Web / Neural Network Engine (Hero Section)
 * 2. Mobile Navigation Drawer & Focus Management
 * 3. Sticky Navbar & ScrollSpy Active Section Highlighting
 * 4. Hero Code Mockup Typing & Tab Switcher
 * 5. Project Category Filtering Engine
 * 6. FAQ Interactive Accordion
 * 7. Real-Time Contact Form Validation & Submission Feedback
 * 8. Scroll Reveal Animations (IntersectionObserver)
 * 9. Floating Back-to-Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Interactive HTML5 Canvas Spider-Web / Neural Network Animation
  // =========================================================================
  const initHeroCanvas = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('home');
    let animationFrameId;
    let isCanvasVisible = true;

    // Retina DPI Scaling & Canvas Sizing
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      const rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    // Mouse & Touch Tracking State
    const mouse = {
      x: null,
      y: null,
      radius: 140, // Interaction radius
      isActive: false
    };

    // Track cursor on hero section
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isActive = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.isActive = false;
    });

    // Touch Support for Mobile / Tablet
    heroSection.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.isActive = true;
      }
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.isActive = true;
      }
    }, { passive: true });

    heroSection.addEventListener('touchend', () => {
      mouse.isActive = false;
    }, { passive: true });

    // Particle / Node Class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Subtle drifting speeds
        this.vx = (Math.random() - 0.5) * 0.65;
        this.vy = (Math.random() - 0.5) * 0.65;
        this.baseRadius = Math.random() * 2 + 1.5;
        this.radius = this.baseRadius;
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
        // Theme node colors (Indigo / Sky Blue shades)
        this.color = Math.random() > 0.3 ? 'rgba(79, 70, 229, 0.7)' : 'rgba(14, 165, 233, 0.7)';
      }

      update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Bounce gently at canvas boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle pulsing effect
        this.pulseAngle += this.pulseSpeed;
        this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 0.5;

        // Mouse Attraction / Interaction Physics
        if (mouse.isActive && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius && distance > 0) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Gentle pull towards cursor
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 0.9;
            this.y += Math.sin(angle) * force * 0.9;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Dynamic Particle Density Calculation
    let particles = [];
    const createParticles = () => {
      particles = [];
      // Calculate count based on viewport area
      const count = Math.floor((width * height) / 14000);
      const particleCount = Math.max(35, Math.min(count, 85));

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    createParticles();

    // Distance threshold for spider-web lines
    const maxDistance = width < 768 ? 95 : 125;

    // Render & Animation Loop
    const animate = () => {
      if (!isCanvasVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Spider-Web Connecting Lines between Particle Pairs
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Draw Dynamic Web Connection Lines to Mouse Pointer
      if (mouse.isActive && mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < particles.length; i++) {
          const dx = mouse.x - particles[i].x;
          const dy = mouse.y - particles[i].y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.55;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }

        // Draw small cursor anchor node
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 70, 229, 0.85)';
        ctx.fill();
      }

      // 3. Update & Draw Particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Debouncing
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 150);
    });

    // Performance Optimization: Pause rendering when Hero is offscreen
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isCanvasVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });

      heroObserver.observe(heroSection);
    }
  };

  initHeroCanvas();

  // =========================================================================
  // 2. Mobile Navigation Drawer & Hamburger Toggle
  // =========================================================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !hamburger.classList.contains('active');
    
    hamburger.classList.toggle('active', isOpen);
    mobileMenu.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => toggleMenu());

    // Close mobile menu when clicking any link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close mobile menu on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.classList.contains('active')) {
        toggleMenu(false);
      }
    });

    // Close when clicking outside menu
    document.addEventListener('click', (e) => {
      if (
        hamburger.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  // =========================================================================
  // 3. Sticky Navbar & ScrollSpy Active Section Highlighting
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], main[id]');

  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ScrollSpy Active Section Tracking
  const updateScrollspy = () => {
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateScrollspy, { passive: true });

  // =========================================================================
  // 4. Hero Code Mockup Typing Effect & Tab Switcher
  // =========================================================================
  const codeElement = document.getElementById('heroCodeSnippet');
  const editorTabs = document.querySelectorAll('.editor-tab');

  const codeSnippets = {
    build: [
      '<span class="code-keyword">const</span> <span class="code-func">developer</span> = {',
      '  name: <span class="code-str">"Sachin Verma"</span>,',
      '  role: <span class="code-str">"Web Developer"</span>,',
      '  location: <span class="code-str">"Lakhimpur, India"</span>,',
      '  email: <span class="code-str">"sachinverm10x@gmail.com"</span>,',
      '  skills: [<span class="code-str">"HTML5"</span>, <span class="code-str">"CSS3"</span>, <span class="code-str">"JS"</span>, <span class="code-str">"WordPress"</span>],',
      '  responsive: <span class="code-bool">true</span>,',
      '  pageSpeed: <span class="code-str">"99+"</span>,',
      '  hireable: <span class="code-bool">true</span>',
      '};',
      '',
      '<span class="code-keyword">export default</span> developer;'
    ].join('\n'),

    tech: [
      '{',
      '  <span class="code-prop">"developer"</span>: <span class="code-str">"Sachin Verma"</span>,',
      '  <span class="code-prop">"location"</span>: <span class="code-str">"Lakhimpur, UP, India"</span>,',
      '  <span class="code-prop">"email"</span>: <span class="code-str">"sachinverm10x@gmail.com"</span>,',
      '  <span class="code-prop">"stack"</span>: [',
      '    <span class="code-str">"Frontend Mastery"</span>,',
      '    <span class="code-str">"WordPress CMS"</span>,',
      '    <span class="code-str">"Python Automations"</span>',
      '  ],',
      '  <span class="code-prop">"standards"</span>: <span class="code-str">"Pixel-Perfect &amp; SEO-Ready"</span>,',
      '  <span class="code-prop">"status"</span>: <span class="code-str">"Open for Projects"</span>',
      '}'
    ].join('\n')
  };

  if (codeElement) {
    codeElement.innerHTML = codeSnippets.build;

    editorTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        editorTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabKey = tab.getAttribute('data-tab');
        if (codeSnippets[tabKey]) {
          codeElement.style.opacity = '0';
          setTimeout(() => {
            codeElement.innerHTML = codeSnippets[tabKey];
            codeElement.style.opacity = '1';
          }, 150);
        }
      });
    });
  }

  // =========================================================================
  // 5. Project Filtering Engine
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // =========================================================================
  // 6. FAQ Accordion Interaction
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other accordion items for clean UX
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const btn = otherItem.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================================
  // 7. Contact Form Real-Time Validation & Submission Handler
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const projectTypeSelect = document.getElementById('projectType');
  const messageInput = document.getElementById('userMessage');
  const charCount = document.getElementById('charCount');
  const submitBtn = document.getElementById('submitBtn');
  const formStatusBanner = document.getElementById('formStatusBanner');

  // Character Counter for Message Area
  if (messageInput && charCount) {
    messageInput.addEventListener('input', () => {
      const currentLength = messageInput.value.length;
      charCount.textContent = `${currentLength}/500`;
      if (currentLength >= 480) {
        charCount.style.color = 'var(--accent-red)';
      } else {
        charCount.style.color = 'var(--text-light)';
      }
    });
  }

  // Helper: Set Error State
  const setError = (groupId, errorId, message) => {
    const group = document.getElementById(groupId);
    const errorSpan = document.getElementById(errorId);
    if (group && errorSpan) {
      group.classList.add('has-error');
      errorSpan.textContent = message;
    }
  };

  // Helper: Clear Error State
  const clearError = (groupId, errorId) => {
    const group = document.getElementById(groupId);
    const errorSpan = document.getElementById(errorId);
    if (group && errorSpan) {
      group.classList.remove('has-error');
      errorSpan.textContent = '';
    }
  };

  // Clear errors dynamically on input
  if (nameInput) nameInput.addEventListener('input', () => clearError('groupName', 'nameError'));
  if (emailInput) emailInput.addEventListener('input', () => clearError('groupEmail', 'emailError'));
  if (projectTypeSelect) projectTypeSelect.addEventListener('change', () => clearError('groupProjectType', 'projectTypeError'));
  if (messageInput) messageInput.addEventListener('input', () => clearError('groupMessage', 'messageError'));

  // Form Submission Validation
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal) {
        setError('groupName', 'nameError', 'Please enter your name.');
        isValid = false;
      } else if (nameVal.length < 2) {
        setError('groupName', 'nameError', 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        clearError('groupName', 'nameError');
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        setError('groupEmail', 'emailError', 'Please enter your email address.');
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        setError('groupEmail', 'emailError', 'Please enter a valid email address (e.g. you@domain.com).');
        isValid = false;
      } else {
        clearError('groupEmail', 'emailError');
      }

      // Validate Project Type
      const projectTypeVal = projectTypeSelect ? projectTypeSelect.value : '';
      if (!projectTypeVal) {
        setError('groupProjectType', 'projectTypeError', 'Please select a project type.');
        isValid = false;
      } else {
        clearError('groupProjectType', 'projectTypeError');
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : '';
      if (!messageVal) {
        setError('groupMessage', 'messageError', 'Please provide a brief description of your project.');
        isValid = false;
      } else if (messageVal.length < 10) {
        setError('groupMessage', 'messageError', 'Message should be at least 10 characters.');
        isValid = false;
      } else {
        clearError('groupMessage', 'messageError');
      }

      // If invalid, focus the first invalid field
      if (!isValid) {
        const firstErrorGroup = contactForm.querySelector('.has-error');
        if (firstErrorGroup) {
          const input = firstErrorGroup.querySelector('input, select, textarea');
          if (input) input.focus();
        }
        return;
      }

      // Proceed with Animated Submission Simulation
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulated network dispatch (1.2s delay)
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show Success Banner
        formStatusBanner.className = 'form-status-banner success';
        formStatusBanner.innerHTML = `
          <strong>Thank you, ${nameVal}!</strong> Your message has been received. 
          I will review your project details and get back to you within 24 hours.
        `;

        // Reset form inputs & counter
        contactForm.reset();
        if (charCount) charCount.textContent = '0/500';

        // Auto-dismiss banner after 8 seconds
        setTimeout(() => {
          formStatusBanner.style.opacity = '0';
          setTimeout(() => {
            formStatusBanner.className = 'form-status-banner';
            formStatusBanner.innerHTML = '';
            formStatusBanner.style.opacity = '1';
          }, 300);
        }, 8000);

      }, 1200);
    });
  }

  // =========================================================================
  // 8. Scroll Reveal Animations (IntersectionObserver)
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // =========================================================================
  // 9. Floating Back-to-Top Button
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    const handleScrollBtn = () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScrollBtn, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
