// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initScrollEffects();
    initMobileMenu();
    initDownloadResume();
    initProfileImage();
});

// Profile Image handling
function initProfileImage() {
    const profileImg = document.querySelector('.profile-img');
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    
    if (profileImg) {
        // Handle image load success
        profileImg.addEventListener('load', function() {
            this.classList.add('loaded');
            if (profilePlaceholder) {
                profilePlaceholder.style.display = 'none';
            }
        });
        
        // Handle image load error (fallback to placeholder)
        profileImg.addEventListener('error', function() {
            console.log('Profile image failed to load, showing placeholder');
            this.style.display = 'none';
            if (profilePlaceholder) {
                profilePlaceholder.style.display = 'flex';
            }
        });
        
        // Check if image is already loaded (cached)
        if (profileImg.complete && profileImg.naturalHeight !== 0) {
            profileImg.classList.add('loaded');
            if (profilePlaceholder) {
                profilePlaceholder.style.display = 'none';
            }
        }
    }
}

// Navigation functionality - FIXED
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                // Use smooth scrolling
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-menu');
                const navToggle = document.getElementById('nav-toggle');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Update active navigation link on scroll
    let ticking = false;
    function updateActiveNav() {
        if (!ticking) {
            requestAnimationFrame(() => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 120;
                    const sectionHeight = section.clientHeight;
                    
                    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    // Initial call to set active nav
    updateActiveNav();
}

// Typing animation for hero section - FIXED to not interfere with navigation
function initTypingAnimation() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;
    
    const roles = [
        'Java Full Stack Developer',
        'SR University Graduate',
        'Spring Boot Specialist', 
        'React Developer',
        'Software Engineer',
        'Java  Expert'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let isTypingPaused = false;

    function typeRole() {
        if (isTypingPaused) {
            setTimeout(typeRole, 100);
            return;
        }
        
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingDelay = 500;
        }

        setTimeout(typeRole, typingDelay);
    }

    // Start typing animation
    typeRole();
    
    // Pause typing when scrolling to prevent navigation interference
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        isTypingPaused = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isTypingPaused = false;
        }, 200);
    });
}

// Scroll animations - ENHANCED
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -10px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .education-item, .cert-item, .highlight-item, .publication-card');
    
    animateElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${Math.min(index * 0.1, 1)}s`;
        observer.observe(element);
    });
}

// Skill bar animations - FIXED
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                // Add a delay for better visual effect
                setTimeout(() => {
                    skillBar.style.width = width;
                }, 300);
                
                // Stop observing this element
                skillObserver.unobserve(skillBar);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Contact form handling - FIXED
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Simulate form submission
            setTimeout(() => {
                showNotification('Thank you! Your message has been sent successfully. I will get back to you soon!', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 1500);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system - ENHANCED
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Color mapping for different types
    const colors = {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        warning: 'var(--color-warning)'
    };
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-surface);
        color: var(--color-text);
        padding: 16px 24px;
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid ${colors[type] || colors.info};
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        max-width: 350px;
        font-size: 14px;
        line-height: 1.4;
        border: 1px solid var(--color-border);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Scroll effects for navbar
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
}

// Mobile menu functionality - FIXED
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Add escape key support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Download resume functionality
function initDownloadResume() {
    const downloadBtn = document.getElementById('download-resume');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a downloadable resume content
            const resumeContent = generateResumeContent();
            const blob = new Blob([resumeContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Kunchala_Shiva_Kiran_Resume.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showNotification('Resume downloaded successfully!', 'success');
        });
    }
}

// Generate resume content
function generateResumeContent() {
    return `
KUNCHALA SHIVA KIRAN
Java Full Stack Developer | Inspaner Academy Graduate | Software Engineer
================================================================================

CONTACT INFORMATION:
Email: shivakiran9392@gmail.com
Phone: +91 9392373464
Address: 27-14-114/1, Shiva Sai Colony, Hasanparthy, Warangal, Telangana - 506001
LinkedIn: https://www.linkedin.com/in/shiva-kiran-kunchala-1aa736253/
GitHub: https://github.com/kshivakiran

PROFESSIONAL SUMMARY:
Passionate Java Full Stack Developer and proud graduate of Inspaner Academy with 
comprehensive training in modern development technologies. Expertise in Java 17, 
Spring Boot 3.2, React 18, and MySQL with hands-on experience in building scalable 
web applications. Currently pursuing B.Tech in Computer Science & Engineering with 
strong academic performance and practical project experience.

TECHNICAL SKILLS:
Programming Languages: Java 17, JavaScript, SQL, Python
Frameworks & Technologies: Spring Boot 3.2, React 18, JSP, Servlets, HTML5, CSS3, Bootstrap 5
Databases: MySQL, JDBC
Cloud Platforms: AWS, Microsoft Azure
Tools & IDEs: Eclipse, VS Code, Git, Maven
Specializations: Full Stack Development, Cybersecurity, AI/ML

EDUCATION & TRAINING:
Java Full Stack Developer Training
Inspaner Academy, Dilsukhnagar, Hyderabad (2025)
• Comprehensive training in Java Full Stack Development
• Hands-on experience with Java 17, Spring Boot 3.2, React 18, MySQL
• Modern development practices and industry best practices

Bachelor of Technology - Computer Science & Engineering
SR University, Warangal (2020 - 2024) - 72%
• Strong foundation in software development and computer science fundamentals
• Focus on algorithms, data structures, and software engineering principles

FEATURED PROJECTS:
1. JAVA CAREER HUB - Full Stack Platform
   Technologies: Java 17, Spring Boot 3.2, React 18, MySQL
   GitHub: https://github.com/kshivakiran/java-career-hub
   • Comprehensive career platform with 7+ integrated tools for Java developers
   • Features include salary calculator, technology trends dashboard, resume builder
   • Demonstrates advanced full-stack development capabilities with modern tech stack

2. Chatbot Based Online Shopping Application
   Technologies: Dialogflow, NLP, AI/ML
   • Published research in Indian Journal of Data Communication and Networking (2024)
   • Innovative chatbot system for product recommendation using NLP
   • Research contribution to the field of conversational AI in e-commerce

3. Profile Analyzer Through Smart Glasses
   Technologies: Computer Vision, Machine Learning, Face Recognition
   • Developed intelligent profile analyzer using smart glasses technology
   • Enables efficient student information retrieval through facial recognition
   • Demonstrates expertise in computer vision and ML applications

4. Connect to Campus Web Platform
   Technologies: JSP, Servlets, JDBC, MySQL
   • Web-based communication platform for educational institutions
   • Secure login/registration system with responsive design
   • Full-stack web development with database integration

5. Asthma Risk Prediction System
   Technologies: Python, TensorFlow, SVM, Random Forest
   • Machine learning solution for asthma risk prediction
   • Combines multiple algorithms for accurate health predictions
   • Python GUI for user-friendly interaction

CERTIFICATIONS:
• CCNA: Introduction to Networks (Cisco)
• Cybersecurity Essentials (Cisco)
• Introduction to Python (Cisco)
• Microsoft Certified: Azure AI Fundamentals
• AWS Academy Graduate - AWS Academy Data Engineering
• AWS Cloud Foundation

PUBLICATIONS:
• "Chatbot Based Online Shopping Web Application" - Indian Journal of Data Communication 
  and Networking (2024) - Co-author research paper on innovative e-commerce chatbot solutions

ACHIEVEMENTS:
• Inspaner Academy Graduate - Java Full Stack Development
• Team leader in Hackathon'22 competition
• Microsoft certification achievement
• Published research in peer-reviewed journal
• Strong academic performance with 72% in B.Tech CSE

KEY STRENGTHS:
• Full-stack development with modern Java technologies
• Strong problem-solving and analytical skills
• Team leadership and project management experience
• Research and publication experience
• Continuous learning and technology adaptation
• Strong foundation in software engineering principles

INTERESTS:
• Building innovative software solutions
• Modern Java development practices
• Full-stack web development
• Machine learning applications
• Open source contributions
• Technology research and development

CAREER OBJECTIVE:
To leverage my comprehensive training from Inspaner Academy and technical expertise 
in Java Full Stack Development to contribute to innovative software projects and 
grow as a professional developer in a dynamic technology environment.
================================================================================
Generated on: ${new Date().toLocaleDateString()}
Contact: shivakiran9392@gmail.com | +91 9392373464
    `.trim();
}

// Smooth scroll polyfill for older browsers
function smoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const targetTop = target.offsetTop - 80;
                    const startTop = window.pageYOffset;
                    const distance = targetTop - startTop;
                    const startTime = performance.now();
                    
                    function animateScroll(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / 800, 1);
                        const easeInOutCubic = progress < 0.5 
                            ? 4 * progress * progress * progress 
                            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                        
                        window.scrollTo(0, startTop + distance * easeInOutCubic);
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateScroll);
                        }
                    }
                    
                    requestAnimationFrame(animateScroll);
                }
            });
        });
    }
}

// Initialize smooth scroll polyfill
smoothScrollPolyfill();

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Initialize any additional setup after page load
    setTimeout(() => {
        // Trigger initial skill bar check if user is already scrolled
        const skillsSection = document.getElementById('skills');
        if (skillsSection && window.scrollY > skillsSection.offsetTop - window.innerHeight) {
            const skillBars = skillsSection.querySelectorAll('.skill-progress');
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    }, 1000);
});

// Enhanced profile image interactions
function enhanceProfileImageInteraction() {
    const profileContainer = document.querySelector('.profile-image-container');
    const profileImg = document.querySelector('.profile-img');
    
    if (profileContainer) {
        // Add keyboard accessibility
        profileContainer.setAttribute('tabindex', '0');
        profileContainer.setAttribute('role', 'img');
        profileContainer.setAttribute('aria-label', 'Profile photo of Kunchala Shiva Kiran, Java Full Stack Developer and Inspaner Academy Graduate');
        
        profileContainer.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showNotification('Professional photo by Kunchala Shiva Kiran - Inspaner Academy Graduate', 'info');
            }
        });
    }
}

// Initialize enhanced interactions after DOM load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(enhanceProfileImageInteraction, 1000);
});

// Performance optimization: Intersection Observer for lazy loading
function initPerformanceOptimizations() {
    // Lazy load any future images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize performance optimizations
initPerformanceOptimizations();

// Utility functions
const utils = {
    // Debounce function for scroll events
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format date
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Add dynamic copyright year
document.addEventListener('DOMContentLoaded', function() {
    const footerText = document.querySelector('.footer p');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.innerHTML = footerText.innerHTML.replace('2024', currentYear);
    }
});

// Add page visibility handling for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - optimizing performance');
    } else {
        console.log('Page visible - resuming normal operations');
    }
});

// Add error handling for images
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
        });
    });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', handleImageErrors);

// Console welcome message
console.log(`
🚀 Welcome to Kunchala Shiva Kiran's Portfolio!
📧 Contact: shivakiran9392@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/shiva-kiran-kunchala-1aa736253/
💻 GitHub: https://github.com/kshivakiran
🎓 Inspaner Academy Graduate - Java Full Stack Developer

This portfolio showcases modern web development with:
• Java 17 & Spring Boot 3.2
• React 18 & Modern JavaScript
• Responsive Design & Accessibility
• Professional UI/UX Design
`);
