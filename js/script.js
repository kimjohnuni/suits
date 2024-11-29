




/*MOBILE MENU*/
// Navigation System Class
// Navigation System Class
class NavigationSystem {
    constructor() {
        this.state = {
            isMenuOpen: false,
            isDropdownOpen: false,
            isMobile: window.innerWidth <= 900
        };

        this.elements = {
            hamburger: document.querySelector('.mobile-nav__hamburger'),
            mobileNav: document.querySelector('.mobile-nav'),
            dropdown: document.querySelector('.mobile-nav__dropdown'),
            dropdownTrigger: document.querySelector('.mobile-nav__dropdown-trigger'),
            dropdownContent: document.querySelector('.mobile-nav__dropdown-content'),
            allNavLinks: document.querySelectorAll('.mobile-nav__item, .mobile-nav__dropdown-content a'),
            bottomNavLinks: document.querySelectorAll('.bottom-navbar .menu a'),
            bottomNavDropdown: document.querySelector('.bottom-navbar .dropdown'),
            bottomNavDropdownContent: document.querySelector('.bottom-navbar .dropdown-content'),
            headerText: document.querySelector('#navbar-text')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileNav();
        this.setupScrollHandler();
    }

    setupScrollHandler() {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                this.updateHeaderTextOnScroll();
            });
        });
    }

    updateHeaderTextOnScroll() {
        const scrollPosition = window.scrollY;

        const sections = {
            'artist-statement': "ARTIST STATEMENT",
            'busan-section': "BUSAN",
            'hongkong-section': "HONG KONG",
            'iceland-section': "ICELAND",
            'myanmar-section': "MYANMAR",
            'peru-section': "PERU",
            'manila-section': "MANILA",
            'seoul-section': "SEOUL",
            'singapore-section': "SINGAPORE",
            'tibet-section': "TIBET",
            'otherworks-section': "OTHER WORKS",
            'exhibition-section': "EXHIBITIONS",
            'contact-section': "CONTACT"
        };

        let currentSection = "SUITMAN'S PORTRAITS";

        Object.entries(sections).forEach(([id, title]) => {
            const element = document.getElementById(id);
            if (element && scrollPosition >= element.offsetTop - 200) {
                currentSection = title;
            }
        });

        if (this.elements.headerText) {
            this.elements.headerText.textContent = currentSection;
        }
    }

    setupEventListeners() {
        // Hamburger menu toggle
        this.elements.hamburger?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Dropdown toggle
        this.elements.dropdownTrigger?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && !this.elements.mobileNav.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.state.isMobile = window.innerWidth <= 900;
            if (!this.state.isMobile) {
                this.closeMenu();
                this.closeDropdown();
            }
        }, 250));

        // Bottom navbar smooth scroll
        this.elements.bottomNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    this.smoothScroll(href);
                }
            });
        });

        // Bottom navbar dropdown hover
        if (this.elements.bottomNavDropdown) {
            this.elements.bottomNavDropdown.addEventListener('mouseenter', () => {
                this.elements.bottomNavDropdownContent.style.display = 'block';
            });

            this.elements.bottomNavDropdown.addEventListener('mouseleave', () => {
                this.elements.bottomNavDropdownContent.style.display = 'none';
            });
        }

        // Setup smooth scrolling
        this.setupSmoothScroll();
    }

    setupMobileNav() {
        if (this.elements.mobileNav) {
            this.elements.mobileNav.style.display = 'block';
            this.elements.mobileNav.style.transform = 'scale(0)';
            this.elements.mobileNav.style.visibility = 'hidden';
        }
    }

    toggleMenu() {
        this.state.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.state.isMenuOpen = true;
        this.elements.mobileNav.style.visibility = 'visible';
        this.elements.mobileNav.style.transform = 'scale(1)';
        this.elements.hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.state.isMenuOpen = false;
        this.elements.mobileNav.style.transform = 'scale(0)';
        this.elements.hamburger.classList.remove('active');
        document.body.style.overflow = '';

        // Close dropdown when menu closes
        this.closeDropdown();

        setTimeout(() => {
            if (!this.state.isMenuOpen) {
                this.elements.mobileNav.style.visibility = 'hidden';
            }
        }, 300);
    }

    toggleDropdown() {
        this.state.isDropdownOpen ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown() {
        this.state.isDropdownOpen = true;
        this.elements.dropdown.classList.add('active');
    }

    closeDropdown() {
        this.state.isDropdownOpen = false;
        this.elements.dropdown.classList.remove('active');
    }

    setupSmoothScroll() {
        this.elements.allNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    this.smoothScroll(href);
                }
            });
        });
    }

    smoothScroll(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 150;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(1500, Math.max(300, Math.abs(distance) / 2));

        // Close menu immediately
        this.closeMenu();

        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            window.scrollTo(0, startPosition + distance * this.easeInOutCubic(progress));

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        const startTime = performance.now();
        requestAnimationFrame(animation);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NavigationSystem();
});









/* HEADER */











/* MODAL FOR OTHER WORKS */
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('.other-works-modal');
    const modalContent = document.querySelector('.other-works-modal-content');
    const closeBtn = document.querySelector('.other-works-modal-close');
    const galleryItems = document.querySelectorAll('.other-works-gallery-item img');
    let startY;
    let currentY;

    // Open modal with content
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const modalImg = modal.querySelector('.other-works-modal-image img');
            const figureNumber = modal.querySelector('.figure-number');
            const medium = modal.querySelector('.medium');
            const size = modal.querySelector('.size');

            // Set content
            modalImg.src = this.getAttribute('data-full-img');
            figureNumber.textContent = this.getAttribute('data-figure');

            // Format medium text with bold MEDIUM
            medium.innerHTML = '<span class="label">MEDIUM</span>: ' + this.getAttribute('data-medium');

            // Format size text with bold SIZE
            size.innerHTML = '<span class="label">SIZE</span>: ' + this.getAttribute('data-size');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal with button
    closeBtn.addEventListener('click', closeModal);

    // Handle touch events for pull-down to close
    modalContent.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
    });

    modalContent.addEventListener('touchmove', e => {
        if (modalContent.scrollTop === 0) {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 0) {
                e.preventDefault();
                modalContent.style.transform = `translateY(${diff}px)`;
            }
        }
    });

    modalContent.addEventListener('touchend', e => {
        if (currentY && currentY - startY > 100) {
            closeModal();
        } else {
            modalContent.style.transform = '';
        }
        startY = null;
        currentY = null;
    });

    function closeModal() {
        modal.classList.add('closing');
        modalContent.addEventListener('transitionend', function handler() {
            modal.classList.remove('active', 'closing');
            document.body.style.overflow = '';
            modalContent.style.transform = '';
            modalContent.removeEventListener('transitionend', handler);
        });
    }
});







// MODAL FOR EXHIBITION PAGE
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.querySelector('.exhibition-modal');
    const modalContent = document.querySelector('.exhibition-modal-content');
    const closeBtn = document.querySelector('.exhibition-modal-close');
    const exhibitionItems = document.querySelectorAll('.exhibition-item .image-container');
    let startY;
    let currentY;

    const exhibitionContent = {
        'pwk': {
            image: 'img/exhibition/pwk.jpg'
        },
        'artbusan': {
            image: 'img/exhibition/artbusan.jpg'
        },
        'agnesb': {
            image: 'img/exhibition/agnesb.jpg'
        },
        'factory': {
            image: 'img/exhibition/factory.jpg'
        },
        'tngt': {
            image: 'img/exhibition/tngt.jpg'
        }
    };

    exhibitionItems.forEach(item => {
        item.addEventListener('click', function() {
            const exhibitionId = this.getAttribute('data-exhibition-id');
            const content = exhibitionContent[exhibitionId];

            const modalImg = modal.querySelector('.exhibition-modal-image img');
            modalImg.src = content.image;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal with button
    closeBtn.addEventListener('click', closeModal);

    // Handle touch events for pull-down to close
    modalContent.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
    });

    modalContent.addEventListener('touchmove', e => {
        if (modalContent.scrollTop === 0) {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 0) {
                e.preventDefault();
                modalContent.style.transform = `translateY(${diff}px)`;
            }
        }
    });

    modalContent.addEventListener('touchend', e => {
        if (currentY && currentY - startY > 100) {
            closeModal();
        } else {
            modalContent.style.transform = '';
        }
        startY = null;
        currentY = null;
    });

    function closeModal() {
        modal.classList.add('closing');
        modalContent.addEventListener('transitionend', function handler() {
            modal.classList.remove('active', 'closing');
            document.body.style.overflow = '';
            modalContent.style.transform = '';
            modalContent.removeEventListener('transitionend', handler);
        });
    }
});










//CONTACT Form
const contactInputBoxes = document.querySelectorAll('.contact-input-box, .contact-message-box');
const contactSendButton = document.querySelector('.contact-send-button');

contactInputBoxes.forEach(inputBox => {
    inputBox.addEventListener('focus', function() {
        this.classList.add('focused');
    });

    inputBox.addEventListener('blur', function() {
        if (this.value === '') {
            this.classList.remove('focused');
        }
    });
});

function checkInputs() {
    let allFilled = true;
    contactInputBoxes.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });
    contactSendButton.disabled = !allFilled;
}

contactInputBoxes.forEach(input => {
    input.addEventListener('keyup', checkInputs);
    input.addEventListener('change', checkInputs);
});

// EmailJS form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        .then(() => {
            console.log('SUCCESS!');
            this.reset();
            contactSendButton.disabled = true;
        }, (error) => {
            console.log('FAILED...', error);
        });
});













//SCALE HEADER
/*
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll("[id]");
    const navbarText = document.getElementById("navbar-text");
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburger = document.querySelector('.mobile-nav__hamburger');
    let lastKnownSection = '';
    let isMenuClick = false;

    if (!navbarText || !hamburger || !mobileNav) return;

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded',
            hamburger.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    });

    // Mobile dropdown toggle
    const dropdownTrigger = document.querySelector('.mobile-nav__dropdown-trigger');
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownContent = e.target.closest('.mobile-nav__dropdown').querySelector('.mobile-nav__dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.toggle('show');
            }
        });
    }

    const newTextMap = {
        'home': "SUITMAN'S PORTRAITS",
        'artist-statement': "ARTIST STATEMENT",
        'busan-section': "BUSAN",
        'hongkong-section': "HONG KONG",
        'iceland-section': "ICELAND",
        'myanmar-section': "MYANMAR",
        'peru-section': "PERU",
        'manila-section': "MANILA",
        'seoul-section': "SEOUL",
        'singapore-section': "SINGAPORE",
        'tibet-section': "TIBET",
        'otherworks-section': "OTHER WORKS",
        'exhibition-section': "EXHIBITIONS",
        'contact-section': "CONTACT"
    };

    function updateNavbarTextOnScroll() {
        if (isMenuClick) return;

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight - 200) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId && currentSectionId !== lastKnownSection) {
            lastKnownSection = currentSectionId;
            navbarText.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            navbarText.style.transform = 'scale(0)';
            navbarText.style.opacity = '0';

            setTimeout(() => {
                navbarText.innerText = newTextMap[currentSectionId] || "SUITMAN'S PORTRAITS";
                navbarText.style.transform = 'scale(1)';
                navbarText.style.opacity = '1';
            }, 300);
        }
    }

    window.addEventListener('scroll', () => {
        if (!isMenuClick) {
            updateNavbarTextOnScroll();
        }
    });

    const handleMenuClick = (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        if (targetId && targetId !== '#') {
            isMenuClick = true;

            // Initial animation (scale down)
            navbarText.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            navbarText.style.transform = 'scale(0)';
            navbarText.style.opacity = '0';

            const targetElement = document.querySelector(targetId);
            lastKnownSection = targetId.substring(1);

            // Start scrolling
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Use the scrollend event to detect when scrolling stops
            document.addEventListener('scrollend', function onScrollEnd() {
                setTimeout(() => {
                    navbarText.innerText = newTextMap[lastKnownSection] || "SUITMAN'S PORTRAITS";
                    navbarText.style.transform = 'scale(1)';
                    navbarText.style.opacity = '1';
                    isMenuClick = false;
                    document.removeEventListener('scrollend', onScrollEnd);
                }, 100);
            }, { once: true });

            // Close mobile menu if open
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    };

    // Desktop menu click handlers
    document.querySelectorAll('.menu a, .dropdown-content a').forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Mobile menu click handlers
    document.querySelectorAll('.mobile-nav__item, .mobile-nav__dropdown-content a').forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Initial call to set correct text on page load
    updateNavbarTextOnScroll();
});
*/




/*FADE HEADER
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll("[id]");
    const navbarText = document.getElementById("navbar-text");
    const mobileNav = document.querySelector('.mobile-nav');
    const hamburger = document.querySelector('.mobile-nav__hamburger');
    let lastKnownSection = '';
    let isMenuClick = false;

    if (!navbarText || !hamburger || !mobileNav) return;

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded',
            hamburger.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
        );
    });

    // Mobile dropdown toggle
    const dropdownTrigger = document.querySelector('.mobile-nav__dropdown-trigger');
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownContent = e.target.closest('.mobile-nav__dropdown').querySelector('.mobile-nav__dropdown-content');
            if (dropdownContent) {
                dropdownContent.classList.toggle('show');
            }
        });
    }

    const newTextMap = {
        'home': "SUITMAN'S PORTRAITS",
        'artist-statement': "ARTIST STATEMENT",
        'busan-section': "BUSAN",
        'hongkong-section': "HONG KONG",
        'iceland-section': "ICELAND",
        'myanmar-section': "MYANMAR",
        'peru-section': "PERU",
        'manila-section': "MANILA",
        'seoul-section': "SEOUL",
        'singapore-section': "SINGAPORE",
        'tibet-section': "TIBET",
        'otherworks-section': "OTHER WORKS",
        'exhibition-section': "EXHIBITIONS",
        'contact-section': "CONTACT"
    };

    function updateNavbarTextOnScroll() {
        if (isMenuClick) return;

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight - 200) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId && currentSectionId !== lastKnownSection) {
            lastKnownSection = currentSectionId;
            navbarText.style.transition = 'opacity 0.3s ease';
            navbarText.style.opacity = '0';

            setTimeout(() => {
                navbarText.innerText = newTextMap[currentSectionId] || "SUITMAN'S PORTRAITS";
                navbarText.style.opacity = '1';
            }, 300);
        }
    }

    window.addEventListener('scroll', () => {
        if (!isMenuClick) {
            updateNavbarTextOnScroll();
        }
    });

    const handleMenuClick = (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        if (targetId && targetId !== '#') {
            isMenuClick = true;

            // Initial fade out
            navbarText.style.transition = 'opacity 0.3s ease';
            navbarText.style.opacity = '0';

            const targetElement = document.querySelector(targetId);
            lastKnownSection = targetId.substring(1);

            // Start scrolling
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Use the scrollend event to detect when scrolling stops
            document.addEventListener('scrollend', function onScrollEnd() {
                setTimeout(() => {
                    navbarText.innerText = newTextMap[lastKnownSection] || "SUITMAN'S PORTRAITS";
                    navbarText.style.opacity = '1';
                    isMenuClick = false;
                    document.removeEventListener('scrollend', onScrollEnd);
                }, 100);
            }, { once: true });

            // Close mobile menu if open
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    };

    // Desktop menu click handlers
    document.querySelectorAll('.menu a, .dropdown-content a').forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Mobile menu click handlers
    document.querySelectorAll('.mobile-nav__item, .mobile-nav__dropdown-content a').forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Initial call to set correct text on page load
    updateNavbarTextOnScroll();
});
*/
