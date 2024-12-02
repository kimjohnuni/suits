document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.background-video');
    const mobileSprite = document.querySelector('.mobile-sprite');
    const preloader = document.querySelector('.video-preloader');
    let alreadyLoaded = false;

    // Initial state
    preloader.style.display = 'flex';
    preloader.style.opacity = '1';

    // Initialize both elements with opacity 0
    if (mobileSprite) mobileSprite.style.opacity = '0';
    if (video) video.style.opacity = '0';

    const handleLoad = () => {
        if (alreadyLoaded) return;
        alreadyLoaded = true;

        // Ensure preloader is visible while loading
        preloader.style.opacity = '1';
        preloader.style.display = 'flex';

        setTimeout(() => {
            preloader.style.opacity = '0';

            // Handle mobile sprite
            if (window.innerWidth <= 576 && mobileSprite) {
                void mobileSprite.offsetWidth; // Force reflow
                mobileSprite.style.opacity = '1';
                if (video) video.style.opacity = '0';
            }
            // Handle desktop video
            else if (window.innerWidth > 576 && video) {
                void video.offsetWidth; // Force reflow
                video.style.opacity = '1';
                if (mobileSprite) mobileSprite.style.opacity = '0';
            }

            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 800);
    };

    // Mobile handling
    if (window.innerWidth <= 576 && mobileSprite) {
        const spriteImg = new Image();
        spriteImg.src = mobileSprite.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

        if (spriteImg.complete) {
            handleLoad();
        } else {
            spriteImg.onload = handleLoad;
        }
    }
    // Desktop handling
    else if (window.innerWidth > 576 && video) {
        video.preload = 'auto';

        if (video.readyState >= 3) {
            handleLoad();
        } else {
            video.addEventListener('canplay', handleLoad);
        }
    }

    // Optional: Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 576) {
            if (video) video.style.opacity = '0';
            if (mobileSprite) mobileSprite.style.opacity = '1';
        } else {
            if (mobileSprite) mobileSprite.style.opacity = '0';
            if (video) video.style.opacity = '1';
        }
    });
});









/*MOBILE MENU*/
class NavigationSystem {
    constructor() {
        this.state = {
            isMenuOpen: false,
            isDropdownOpen: false,
            isMobile: window.innerWidth <= 900,
            isScrolling: false
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
            headerText: document.querySelector('#navbar-text'),
            mobileBottomLinks: document.querySelectorAll('.mobile-nav__bottom-buttons a')
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
        this.elements.hamburger?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        this.elements.dropdownTrigger?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && !this.elements.mobileNav.contains(e.target)) {
                this.closeMenu();
            }
        });

        window.addEventListener('resize', this.debounce(() => {
            this.state.isMobile = window.innerWidth <= 900;
            if (!this.state.isMobile) {
                this.closeMenu();
                this.closeDropdown();
            }
        }, 250));

        [...this.elements.bottomNavLinks, ...this.elements.allNavLinks].forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    this.smoothScroll(href);
                    if (this.state.isMenuOpen) {
                        this.closeMenu();
                    }
                }
            });
        });

        this.elements.mobileBottomLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScroll(href);
                    if (this.state.isMenuOpen) {
                        this.closeMenu();
                    }
                }
            });
        });

        if (this.elements.bottomNavDropdown) {
            this.elements.bottomNavDropdown.addEventListener('mouseenter', () => {
                this.elements.bottomNavDropdownContent.style.display = 'block';
            });

            this.elements.bottomNavDropdown.addEventListener('mouseleave', () => {
                this.elements.bottomNavDropdownContent.style.display = 'none';
            });
        }
    }

    setupMobileNav() {
        if (this.elements.mobileNav) {
            this.elements.mobileNav.style.display = 'block';
            this.elements.mobileNav.style.transform = 'scale(0)';
            this.elements.mobileNav.style.visibility = 'hidden';
        }
    }

    toggleMenu() {
        if (this.state.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
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
        this.closeDropdown();

        setTimeout(() => {
            if (!this.state.isMenuOpen) {
                this.elements.mobileNav.style.visibility = 'hidden';
            }
        }, 300);
    }

    toggleDropdown() {
        if (this.state.isDropdownOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        this.state.isDropdownOpen = true;
        this.elements.dropdown.classList.add('active');
    }

    closeDropdown() {
        this.state.isDropdownOpen = false;
        this.elements.dropdown.classList.remove('active');
    }

    smoothScroll(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement || this.state.isScrolling) return;

        this.state.isScrolling = true;

        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const offset = 110;
        const targetPosition = targetElement.offsetTop - headerHeight - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;

        if (this.state.isMobile) {
            const duration = 500;
            const start = performance.now();

            const scroll = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                window.scrollTo(0, startPosition + distance * progress);

                if (progress < 1) {
                    requestAnimationFrame(scroll);
                } else {
                    this.state.isScrolling = false;
                }
            };

            requestAnimationFrame(scroll);
        } else {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            setTimeout(() => {
                this.state.isScrolling = false;
            }, 300);
        }
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

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
    let isDragging = false;

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
            medium.innerHTML = '<span class="label">MEDIUM</span>: ' + this.getAttribute('data-medium');
            size.innerHTML = '<span class="label">SIZE</span>: ' + this.getAttribute('data-size');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modalContent.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
        isDragging = false;
    });

    modalContent.addEventListener('touchmove', e => {
        if (!startY) return;

        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        const wrapper = modal.querySelector('.other-works-modal-inner');

        // Only handle pull-down when at the top of the content
        if (wrapper.scrollTop <= 0 && diff > 0) {
            isDragging = true;
            modalContent.style.transform = `translateY(${Math.min(diff * 0.5, 150)}px)`;
        } else {
            isDragging = false;
            modalContent.style.transform = '';
        }
    });

    modalContent.addEventListener('touchend', e => {
        if (isDragging) {
            const diff = currentY - startY;
            if (diff > 100) {
                closeModal();
            } else {
                modalContent.style.transform = '';
            }
        }
        isDragging = false;
        startY = null;
        currentY = null;
    });

    // Prevent default pull-to-refresh behavior
    document.body.addEventListener('touchmove', function(e) {
        if (modal.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });

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
    const pullDownIndicator = document.querySelector('.pull-down-indicator');
    let startY;
    let currentY;
    let isDragging = false;
    let touchStartedOnIndicator = false;

    // Function to generate modal content
    function generateModalContent(item) {
        const title = item.dataset.title;
        const description = item.dataset.description;
        const modalWrapper = modal.querySelector('.exhibition-modal-content-wrapper');

        // Generate all images HTML
        let imagesHTML = '';
        let imageIndex = 1;
        while (item.dataset[`image${imageIndex}`]) {
            imagesHTML += `<img src="${item.dataset[`image${imageIndex}`]}" alt="${title} - Image ${imageIndex}">`;
            imageIndex++;
        }

        // Put text div first (on the left), then images div
        modalWrapper.innerHTML = `
            <div class="pwk-content-text">
                <h2>${title}</h2>
                <p>${description}</p>
            </div>
            <div class="pwk-content-images">
                ${imagesHTML}
            </div>
        `;
    }

    // Add click event listeners to exhibition items
    exhibitionItems.forEach(item => {
        item.addEventListener('click', () => {
            generateModalContent(item);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close button event listener
    closeBtn.addEventListener('click', closeModal);

    // Touch handling for pull-down indicator
    pullDownIndicator.addEventListener('touchstart', e => {
        startY = e.touches[0].clientY;
        touchStartedOnIndicator = true;
        isDragging = false;
    });

    modalContent.addEventListener('touchstart', e => {
        const touchY = e.touches[0].clientY;
        const modalRect = modalContent.getBoundingClientRect();
        const topThreshold = modalRect.top + 60;

        if (touchY <= topThreshold) {
            startY = e.touches[0].clientY;
            touchStartedOnIndicator = true;
            isDragging = false;
        } else {
            touchStartedOnIndicator = false;
        }
    });

    modalContent.addEventListener('touchmove', e => {
        if (!startY || !touchStartedOnIndicator) return;

        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        const wrapper = modal.querySelector('.exhibition-modal-content-wrapper');

        if (wrapper.scrollTop <= 0 && diff > 0) {
            e.preventDefault();
            isDragging = true;
            modalContent.style.transform = `translateY(${Math.min(diff * 0.5, 150)}px)`;
        } else {
            isDragging = false;
            modalContent.style.transform = '';
        }
    });

    modalContent.addEventListener('touchend', e => {
        if (isDragging && touchStartedOnIndicator) {
            const diff = currentY - startY;
            if (diff > 100) {
                closeModal();
            } else {
                modalContent.style.transform = '';
            }
        }
        startY = null;
        currentY = null;
        isDragging = false;
        touchStartedOnIndicator = false;
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

    // Optional: Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Optional: Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
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
