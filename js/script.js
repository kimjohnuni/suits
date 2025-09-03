// Function to handle all anchor clicks
function handleAnchorClick(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth'
            });
            history.pushState('', '', window.location.pathname);
        }
    }
}

// Add click handlers to desktop menu
document.querySelectorAll('.bottom-navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleAnchorClick);
});

// Add click handlers to mobile menu
document.querySelectorAll('.mobile-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleAnchorClick);
});








const video = document.querySelector('.background-video');
const mobileSprite = document.querySelector('.mobile-sprite');
const preloader = document.querySelector('.video-preloader');
let alreadyLoaded = false;

const handleLoad = () => {
    if (alreadyLoaded) return;
    alreadyLoaded = true;

    if (window.innerWidth <= 576) {
        // Make sure mobileSprite exists before proceeding
        if (mobileSprite) {
            // Wait for sprite to be ready
            const spriteUrl = window.getComputedStyle(mobileSprite)
                .backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');

            if (spriteUrl) {
                const img = new Image();
                img.onload = () => {
                    // First, fade out the preloader
                    preloader.style.transition = 'opacity 0.8s ease';
                    preloader.style.opacity = '0';

                    // Wait for preloader to fade out, then fade in the mobile sprite
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        mobileSprite.style.transition = 'opacity 0.8s ease';
                        mobileSprite.style.opacity = '1';
                    }, 800);
                };
                img.src = spriteUrl;
            } else {
                // Fallback if sprite URL isn't found
                preloader.style.transition = 'opacity 0.8s ease';
                preloader.style.opacity = '0';

                setTimeout(() => {
                    preloader.style.display = 'none';
                    mobileSprite.style.transition = 'opacity 0.8s ease';
                    mobileSprite.style.opacity = '1';
                }, 800);
            }
        }
    } else {
        // Desktop video handling
        preloader.style.transition = 'opacity 0.8s ease';
        preloader.style.opacity = '0';

        setTimeout(() => {
            preloader.style.display = 'none';
            if (video) {
                video.style.transition = 'opacity 0.8s ease';
                video.style.opacity = '1';
            }
        }, 800);
    }
};

// Make sure elements are loaded before running logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.innerWidth <= 576) {
            handleLoad();
        } else {
            if (video) {
                video.preload = 'auto';
                if (video.readyState >= 3) {
                    handleLoad();
                } else {
                    video.addEventListener('canplay', handleLoad);
                }
            }
        }
    });
} else {
    // If DOM is already loaded, run immediately
    if (window.innerWidth <= 576) {
        handleLoad();
    } else {
        if (video) {
            video.preload = 'auto';
            if (video.readyState >= 3) {
                handleLoad();
            } else {
                video.addEventListener('canplay', handleLoad);
            }
        }
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









/*MOBILE MENU*/
class NavigationSystem {
    constructor() {
        this.state = {
            isMenuOpen: false,
            isDropdownOpen: false,
            isScrolling: false,
            isMobile: window.innerWidth <= 900
        };

        this.elements = {
            hamburger: document.querySelector('.mobile-nav__hamburger'),
            mobileNav: document.querySelector('.mobile-nav'),
            dropdown: document.querySelector('.mobile-nav__dropdown'),
            dropdownTrigger: document.querySelector('.mobile-nav__dropdown-trigger'),
            dropdownContent: document.querySelector('.mobile-nav__dropdown-content'),
            bottomNavLinks: document.querySelectorAll('.bottom-navbar .menu a'),
            bottomNavDropdown: document.querySelector('.bottom-navbar .dropdown'),
            bottomNavDropdownContent: document.querySelector('.bottom-navbar .dropdown-content'),
            headerText: document.querySelector('#navbar-text'),
            allNavLinks: document.querySelectorAll('.mobile-nav__item, .mobile-nav__dropdown-content a'),
            mobileBottomLinks: document.querySelectorAll('.mobile-nav__bottom-buttons a')
        };

        this.init();

        // Add cleanup event listener
        window.addEventListener('beforeunload', () => {
            document.body.style.overflow = '';
            this.state.isScrolling = false;
        });
    }

    init() {
        this.setupEventListeners();
        this.setupMobileNav();
        this.setupScrollHandler();
    }

    setupScrollHandler() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateHeaderTextOnScroll();
                    ticking = false;
                });
                ticking = true;
            }

            if (this.state.isScrolling) {
                setTimeout(() => {
                    this.state.isScrolling = false;
                }, 1000);
            }
        }, { passive: true });
    }

    updateHeaderTextOnScroll() {
        const scrollPosition = window.pageYOffset;
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

        // Handle mobile bottom links
        this.elements.mobileBottomLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScroll(href);
                    this.closeMenu();
                }
            });
        });

        // Handle bottom navbar dropdown links
        if (this.elements.bottomNavDropdownContent) {
            const dropdownLinks = this.elements.bottomNavDropdownContent.querySelectorAll('a');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.elements.bottomNavDropdownContent.style.display = 'none';
                });
            });

            // Add touch event handling for iPad
            document.addEventListener('touchstart', (e) => {
                if (!this.elements.bottomNavDropdown.contains(e.target)) {
                    this.elements.bottomNavDropdownContent.style.display = 'none';
                }
            });
        }

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

        if (this.elements.bottomNavDropdown) {
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

            if (!isTouchDevice) {
                this.elements.bottomNavDropdown.addEventListener('mouseenter', () => {
                    this.elements.bottomNavDropdownContent.style.display = 'block';
                });

                this.elements.bottomNavDropdown.addEventListener('mouseleave', () => {
                    this.elements.bottomNavDropdownContent.style.display = 'none';
                });
            } else {
                this.elements.bottomNavDropdown.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (this.elements.bottomNavDropdownContent.style.display === 'block') {
                        this.elements.bottomNavDropdownContent.style.display = 'none';
                    } else {
                        this.elements.bottomNavDropdownContent.style.display = 'block';
                    }
                });

                document.addEventListener('click', (e) => {
                    if (!this.elements.bottomNavDropdown.contains(e.target)) {
                        this.elements.bottomNavDropdownContent.style.display = 'none';
                    }
                });
            }
        }

        window.addEventListener('touchend', () => {
            this.state.isScrolling = false;
        });
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
    }

    closeMenu() {
        this.state.isMenuOpen = false;
        this.elements.mobileNav.style.transform = 'scale(0)';
        this.elements.hamburger.classList.remove('active');
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
        if (!targetElement) return;

        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 0;
        const offset = 110;
        const targetPosition = targetElement.offsetTop - headerHeight - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
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
        const exhibitionId = item.dataset.exhibitionId;

        let imagesHTML = '';
        let imageIndex = 1;

        while (item.dataset[`image${imageIndex}`]) {
            // Check for specific image pairs
            if (
                (exhibitionId === 'pwk' && imageIndex === 1) ||
                (exhibitionId === 'artbusan' && imageIndex === 2) ||
                (exhibitionId === 'agnesb' && imageIndex === 1) ||
                (exhibitionId === 'factory' && imageIndex === 15)
            ) {
                imagesHTML += `<div class="pwk-image-pair">
                    <img src="${item.dataset[`image${imageIndex}`]}" alt="${title} - Image ${imageIndex}">
                    <img src="${item.dataset[`image${imageIndex + 1}`]}" alt="${title} - Image ${imageIndex + 1}">
                </div>`;
                imageIndex += 2;
            } else {
                imagesHTML += `<img src="${item.dataset[`image${imageIndex}`]}" alt="${title} - Image ${imageIndex}">`;
                imageIndex++;
            }
        }

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

// Initialize EmailJS
emailjs.init('-whovk6aQzcWIuoo8');

// Add focus effects to input boxes
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

// Check if all inputs are filled
function checkInputs() {
    let allFilled = true;
    contactInputBoxes.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });
    contactSendButton.disabled = !allFilled;
}

// Add input check listeners
contactInputBoxes.forEach(input => {
    input.addEventListener('keyup', checkInputs);
    input.addEventListener('change', checkInputs);
});

// EmailJS form submission
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Basic email validation
    const emailInput = this.querySelector('input[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        alert('Please enter a valid email address');
        return;
    }

    // Show loading state
    contactSendButton.disabled = true;
    contactSendButton.textContent = 'SENDING...';

    emailjs.sendForm('service_1m3kke9', 'template_d3vrshc', this)
        .then(() => {
            // Success
            console.log('SUCCESS!');
            this.reset();
            contactSendButton.disabled = true;
            contactSendButton.textContent = 'SEND';
            alert('Message sent successfully!');

            // Remove focused class from all inputs
            contactInputBoxes.forEach(input => {
                input.classList.remove('focused');
            });
        }, (error) => {
            // Error
            console.log('FAILED...', error);
            contactSendButton.disabled = false;
            contactSendButton.textContent = 'SEND';
            alert('Failed to send message. Please try again.');
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
