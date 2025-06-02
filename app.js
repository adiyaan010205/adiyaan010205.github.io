class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeIcon = this.themeToggle.querySelector('.theme-icon');
    this.currentTheme = this.getStoredTheme() || 'dark';
    this.init();
  }
  init() {
    this.applyTheme(this.currentTheme);
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }
  getStoredTheme() {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (e) {
      return 'dark';
    }
  }
  setStoredTheme(theme) {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {}
  }
  applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    this.currentTheme = theme;
    this.setStoredTheme(theme);
  }
  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
}

class TypingAnimation {
  constructor(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.init();
  }
  init() {
    this.type();
  }
  type() {
    const currentText = this.texts[this.textIndex];
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }
    let nextDelay = this.isDeleting ? this.deleteSpeed : this.speed;
    if (!this.isDeleting && this.charIndex === currentText.length) {
      nextDelay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
    }
    setTimeout(() => this.type(), nextDelay);
  }
}

class SkillsBubbleManager {
  constructor() {
    this.container = document.getElementById('skills-bubbles');
    this.skills = [
      'Python', 'JavaScript', 'TypeScript', 'C++',
      'React', 'Next.js', 'FastAPI',
      'Tailwind CSS', 'Sass',
      'Git', 'Docker', 'Postman', 'Figma',
      'TensorFlow', 'OpenCV', 'scikit-learn'
    ];
    this.colors = [
      'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      'linear-gradient(135deg, #06b6d4, #0891b2)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #ef4444, #dc2626)',
    ];
    this.init();
  }
  init() {
    this.createBubbles();
  }
  createBubbles() {
    const centerX = this.container.offsetWidth / 2;
    const centerY = this.container.offsetHeight / 2;
    const radiusX = Math.min(centerX - 80, 250);
    const radiusY = Math.min(centerY - 80, 200);
    this.skills.forEach((skill, index) => {
      const bubble = document.createElement('div');
      bubble.className = 'skill-bubble';
      bubble.textContent = skill;
      const size = this.getBubbleSize(skill);
      bubble.classList.add(`size-${size}`);
      const colorIndex = index % this.colors.length;
      bubble.style.background = this.colors[colorIndex];
      const angle = (index / this.skills.length) * 2 * Math.PI;
      const x = centerX + radiusX * Math.cos(angle) - (size === 'large' ? 60 : size === 'medium' ? 50 : 40);
      const y = centerY + radiusY * Math.sin(angle) - (size === 'large' ? 60 : size === 'medium' ? 50 : 40);
      const randomOffsetX = (Math.random() - 0.5) * 40;
      const randomOffsetY = (Math.random() - 0.5) * 40;
      bubble.style.left = `${Math.max(10, Math.min(x + randomOffsetX, this.container.offsetWidth - 120))}px`;
      bubble.style.top = `${Math.max(10, Math.min(y + randomOffsetY, this.container.offsetHeight - 120))}px`;
      bubble.addEventListener('mouseenter', () => {
        bubble.style.transform = 'scale(1.2)';
        bubble.style.zIndex = '10';
      });
      bubble.addEventListener('mouseleave', () => {
        bubble.style.transform = 'scale(1)';
        bubble.style.zIndex = '1';
      });
      this.container.appendChild(bubble);
    });
  }
  getBubbleSize(skill) {
    const primarySkills = ['Python', 'JavaScript', 'React', 'TensorFlow', 'OpenCV'];
    const secondarySkills = ['TypeScript', 'Next.js', 'FastAPI', 'Git', 'Docker'];
    if (primarySkills.includes(skill)) return 'large';
    if (secondarySkills.includes(skill)) return 'medium';
    return 'small';
  }
}

class NavigationManager {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.init();
  }
  init() {
    this.setupScrollHandler();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.updateActiveLink();
  }
  setupScrollHandler() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      this.navbar.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
      this.navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
      this.navbar.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
      this.navbar.style.boxShadow = 'none';
    }
    this.updateActiveLink();
  }
  updateActiveLink() {
    const scrollY = window.scrollY + 100;
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          this.navMenu.classList.remove('active');
        }
      });
    });
  }
  setupMobileMenu() {
    this.mobileToggle.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
    });
  }
}

class ContactFormHandler {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.init();
  }
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }
  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    if (this.validateForm(data)) {
      this.showSuccess();
      this.form.reset();
    }
  }
  validateForm(data) {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }
    if (!data.subject || data.subject.trim().length < 3) {
      errors.push('Subject must be at least 3 characters long');
    }
    if (!data.message || data.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }
    if (errors.length > 0) {
      this.showErrors(errors);
      return false;
    }
    return true;
  }
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  showErrors(errors) {
    alert('Please fix the following errors:\n\n' + errors.join('\n'));
  }
  showSuccess() {
    alert('Thank you for your message! I\'ll get back to you soon.');
  }
}

class ScrollAnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }
  init() {
    this.setupIntersectionObserver();
  }
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, this.observerOptions);
    const animateElements = document.querySelectorAll(
      '.project-card, .timeline-item, .stat-item, .contact-item'
    );
    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const themeManager = new ThemeManager();
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const typingTexts = [
      'Full-Stack Developer',
      'AI/ML Enthusiast',
      'Problem Solver',
      'Tech Innovator'
    ];
    new TypingAnimation(typingElement, typingTexts);
  }
  const skillsBubbleManager = new SkillsBubbleManager();
  const navigationManager = new NavigationManager();
  const contactFormHandler = new ContactFormHandler();
  const scrollAnimationManager = new ScrollAnimationManager();
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const skillsContainer = document.getElementById('skills-bubbles');
      skillsContainer.innerHTML = '';
      new SkillsBubbleManager();
    }, 250);
  });
});

const animationStyles = `
.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
@media (max-width: 768px) {
  .nav-menu.active {
    display: flex !important;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-surface);
    flex-direction: column;
    padding: var(--space-16);
    border-top: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
  }
  .nav-menu.active .nav-link {
    padding: var(--space-12) 0;
    border-bottom: 1px solid var(--color-border);
  }
  .nav-menu.active .nav-link:last-child {
    border-bottom: none;
  }
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
