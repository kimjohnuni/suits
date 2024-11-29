/*BOTTOM NAVBAR TOUCH FUNCTION FOR TABLETS*/
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.bottom-navbar .dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');

        link.addEventListener('click', function(e) {
            if (window.matchMedia('(hover: none)').matches) {
                e.preventDefault();
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('touch-open');
                });
                dropdown.classList.toggle('touch-open');
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('touch-open'));
        }
    });
});





/*MOBILE MENU*/
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.mobile-nav__hamburger');
    const mobileMenu = document.querySelector('.mobile-nav');
    const dropdownTrigger = document.querySelector('.mobile-nav__dropdown-trigger');
    const menuItems = document.querySelectorAll('.mobile-nav__item, .mobile-nav__dropdown-content a');
    let isAnimating = false;

    // Scroll Lock Function
    function toggleBodyScroll(disable) {
        document.body.style.overflow = disable ? 'hidden' : '';
    }

    // Toggle Menu Function
    function toggleMenu() {
        if (isAnimating) return;
        isAnimating = true;

        hamburger.classList.toggle('active');

        if (!mobileMenu.classList.contains('active')) {
            // When opening the menu, ensure dropdown is closed
            const dropdown = document.querySelector('.mobile-nav__dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
            mobileMenu.classList.add('active');
            toggleBodyScroll(true);
        } else {
            closeMenu();
        }

        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    // Close Menu Function
    function closeMenu() {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        toggleBodyScroll(false);
    }

    // Hamburger Click Event
    hamburger.addEventListener('click', () => {
        toggleMenu();
    });

    // Dropdown Click Event
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const dropdown = this.closest('.mobile-nav__dropdown');
            dropdown.classList.toggle('active');
        });
    }

    // Menu Items Click Event
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                closeMenu();

                setTimeout(() => {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 300);
            }
        });
    });

    // Click Outside to Close Menu
    document.addEventListener('click', (e) => {
        if (
            mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Escape Key to Close Menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});












// Smooth scroll functionality
document.querySelectorAll('.menu a, .mobile-nav__item, .mobile-nav__dropdown-content a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection && this.textContent !== 'PORTRAITS') {
                console.log(`Scrolling to: ${targetId}`); // Debugging line
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - 150;
                console.log(`Calculated target position: ${targetPosition}`); // Debugging line

                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;

                const baseDuration = 500;
                const maxDuration = 1500;
                const minDuration = 300;
                const duration = Math.min(maxDuration, Math.max(minDuration, Math.abs(distance) / 2));

                let startTime = null;

                function easeInOutQuad(t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                }

                function animation(currentTime) {
                    if (!startTime) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = easeInOutQuad(timeElapsed / duration) * distance + startPosition;
                    window.scrollTo(0, run);

                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                requestAnimationFrame(animation);

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-nav');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    const hamburger = document.querySelector('.mobile-nav__hamburger');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                    }
                }
            } else {
                console.warn(`Target section not found for: ${targetId}`); // Debugging line
            }
        }
    });
});











/* HEADER */
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
            navbarText.innerText = newTextMap[currentSectionId] || "SUITMAN'S PORTRAITS";
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
            const targetElement = document.querySelector(targetId);
            lastKnownSection = targetId.substring(1);

            navbarText.innerText = newTextMap[lastKnownSection] || "SUITMAN'S PORTRAITS";
            targetElement.scrollIntoView({ behavior: 'smooth' });

            document.addEventListener('scrollend', function onScrollEnd() {
                isMenuClick = false;
                document.removeEventListener('scrollend', onScrollEnd);
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
