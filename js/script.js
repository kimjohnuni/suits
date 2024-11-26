// Mobile Menu Functionality
// Mobile Menu Functionality
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const dropdownTrigger = document.querySelector('.dropdown-trigger');
const dropdownContent = document.querySelector('.dropdown-content');
const menuItems = document.querySelectorAll('.menu-item, .dropdown-content a');
let isAnimating = false;

function toggleBodyScroll(disable) {
    document.body.style.overflow = disable ? 'hidden' : '';
}

function resetDropdown() {
    const dropdown = dropdownTrigger.closest('.dropdown');
    dropdown.classList.remove('active');
    dropdownContent.style.display = 'none';
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    toggleBodyScroll(false);
    setTimeout(() => {
        mobileMenu.style.display = 'none';
        resetDropdown();
        isAnimating = false;
    }, 300);
}

// Click outside to close
document.addEventListener('click', function(event) {
    if (!mobileMenu.contains(event.target) &&
        !hamburger.contains(event.target) &&
        mobileMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Dropdown functionality
dropdownTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const dropdown = dropdownTrigger.closest('.dropdown');
    dropdown.classList.toggle('active');

    if (dropdown.classList.contains('active')) {
        dropdownContent.style.display = 'block';
        // Use requestAnimationFrame to ensure display change happens before opacity
        requestAnimationFrame(() => {
            dropdownContent.style.opacity = '1';
        });
    } else {
        dropdownContent.style.opacity = '0';
        setTimeout(() => {
            dropdownContent.style.display = 'none';
        }, 300); // Match transition duration
    }
});

// Event Listeners
hamburger.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    if (!mobileMenu.classList.contains('active')) {
        mobileMenu.style.display = 'flex';
        requestAnimationFrame(() => {
            mobileMenu.classList.add('active');
            toggleBodyScroll(true);
            setTimeout(() => { isAnimating = false; }, 300);
        });
    } else {
        closeMenu();
    }
});

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!item.closest('.dropdown-content')) {
            closeMenu();
        } else {
            closeMenu();
        }
    });
});












// Menu click handlers for smooth scrolling
document.querySelectorAll('.menu a, .mobile-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if(targetSection) {
                const offset = 50;
                customScrollIntoView(targetSection, 2500); // 2000ms = 2 seconds, adjust this number for faster/slower

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if(mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        }
    });
});

function customScrollIntoView(element, duration = 2000) {
    const targetPosition = element.offsetTop - 50; // 50 is the offset from the top
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function for smoother animation
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

























/*
const sections = [
    { logo: document.querySelector('.main-logo'), section: document.querySelector('.video-container') },
    { logo: document.querySelector('.artist-statement-logo'), section: document.querySelector('#artist-statement') },
    { logo: document.querySelector('.busan-logo'), section: document.querySelector('#busan-section') },
    { logo: document.querySelector('.hongkong-logo'), section: document.querySelector('#hongkong-section') },
    { logo: document.querySelector('.iceland-logo'), section: document.querySelector('#iceland-section') },
    { logo: document.querySelector('.myanmar-logo'), section: document.querySelector('#myanmar-section') },
    { logo: document.querySelector('.peru-logo'), section: document.querySelector('#peru-section') },
    { logo: document.querySelector('.manila-logo'), section: document.querySelector('#manila-section') },
    { logo: document.querySelector('.seoul-logo'), section: document.querySelector('#seoul-section') },
    { logo: document.querySelector('.singapore-logo'), section: document.querySelector('#singapore-section') },
    { logo: document.querySelector('.tibet-logo'), section: document.querySelector('#tibet-section') }
];

let currentIndex = 0;
let lastScrollY = window.scrollY;
let viewportHeight = window.innerHeight;

// Throttle function to limit scroll event firing
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function initializeLogos() {
    const isMobile = window.innerWidth <= 900;
    sections.forEach(({logo}) => {
        if (!isMobile) {
            logo.style.position = 'fixed';
            logo.style.left = '50%';
            logo.style.top = '50%';
            logo.style.transform = 'translate3d(-50%, -50%, 0)';
        }
    });
}

function animateLogoTransition(fromLogo, toLogo, direction) {
    const animationDuration = 300;
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
        fromLogo.style.opacity = '0';
        toLogo.style.opacity = '1';
    } else {
        fromLogo.animate([
            { transform: 'translate3d(-50%, -50%, 0)', opacity: 1 },
            { transform: `translate3d(-50%, ${direction === 'down' ? '20px' : '-70px'}, 0)`, opacity: 0 }
        ], { duration: animationDuration, fill: 'forwards' });

        toLogo.animate([
            { transform: `translate3d(-50%, ${direction === 'down' ? '-70px' : '20px'}, 0)`, opacity: 0 },
            { transform: 'translate3d(-50%, -50%, 0)', opacity: 1 }
        ], { duration: animationDuration, fill: 'forwards' });
    }
}

function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const newIndex = sections.findIndex(section =>
                    section.section === entry.target);
                if (newIndex !== currentIndex) {
                    animateLogoTransition(
                        sections[currentIndex].logo,
                        sections[newIndex].logo,
                        window.scrollY > lastScrollY ? 'down' : 'up'
                    );
                    currentIndex = newIndex;
                    sessionStorage.setItem('currentSectionIndex', newIndex);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-30% 0px -70% 0px'
    });

    sections.forEach(section => {
        observer.observe(section.section);
    });
}

const handleScroll = throttle(() => {
    if (window.innerWidth <= 900) return;
    const scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
    sections.forEach((section, index) => {
        const rect = section.section.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.3 && rect.bottom >= viewportHeight * 0.3) {
            if (index !== currentIndex) {
                animateLogoTransition(sections[currentIndex].logo, section.logo, scrollDirection);
                currentIndex = index;
                sessionStorage.setItem('currentSectionIndex', index);
            }
        }
    });
    lastScrollY = window.scrollY;
}, 100);

function initializeCurrentSection() {
    const isMobile = window.innerWidth <= 900;

    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].section.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.3 && rect.bottom >= viewportHeight * 0.3) {
            currentIndex = i;
            sessionStorage.setItem('currentSectionIndex', i);
            sections[i].logo.style.opacity = '1';
            if (isMobile) {
                sections[i].logo.style.transform = 'translate3d(0, 0, 0)';
            }
            break;
        }
    }
}

function setInitialState() {
    const storedIndex = sessionStorage.getItem('currentSectionIndex');
    const isMobile = window.innerWidth <= 900;

    sections.forEach(({logo}) => {
        if (!isMobile) {
            logo.style.position = 'fixed';
            logo.style.left = '50%';
            logo.style.top = '50%';
            logo.style.transform = 'translate3d(-50%, -50%, 0)';
        }
    });

    if (storedIndex !== null) {
        currentIndex = parseInt(storedIndex);
        sections[currentIndex].logo.style.opacity = '1';
        if (isMobile) {
            sections[currentIndex].logo.style.transform = 'translate3d(0, 0, 0)';
        }
    } else {
        initializeCurrentSection();
    }
}

// Event Listeners
window.addEventListener('resize', () => {
    viewportHeight = window.innerHeight;
    setInitialState();
});

window.addEventListener('scroll', handleScroll, { passive: true });

window.addEventListener('load', initializeLogos);

document.addEventListener('DOMContentLoaded', () => {
    setInitialState();
    setupIntersectionObserver();
});

// Menu click handlers
document.querySelectorAll('.menu a, .mobile-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if(targetSection) {
                const offset = 50;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                const mobileMenu = document.querySelector('.mobile-menu');
                if(mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        }
    });
});








// FADE OUT PORTRAIT H2
// Get all portrait title elements
const portraitsTitles = document.querySelectorAll('.portraits h2');
let lastScrollPosition = window.pageYOffset;

// Add scroll event listener
window.addEventListener('scroll', () => {
    const currentScrollPosition = window.pageYOffset;
    const scrollingDown = currentScrollPosition > lastScrollPosition;

    // Loop through all portrait titles
    portraitsTitles.forEach(title => {
        const elementPosition = title.getBoundingClientRect().top;
        const fadeOutThreshold = 100;
        const fadeInThreshold = 500;

        if (scrollingDown) {
            // Fade out calculation when scrolling down
            if (elementPosition < fadeInThreshold) {
                const opacity = Math.max(0, elementPosition / fadeOutThreshold);
                title.style.opacity = opacity;
            }
        } else {
            // Fade in calculation when scrolling up
            const opacity = Math.min(1, elementPosition / fadeInThreshold);
            title.style.opacity = opacity;
        }
    });

    lastScrollPosition = currentScrollPosition;
});







/*
// Image Loading
document.querySelectorAll('.portraits__gallery img').forEach(img => {
    const aspectRatio = 1;
    img.style.height = (img.offsetWidth * aspectRatio) + 'px';
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// Initialize
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
window.addEventListener('resize', () => viewportHeight = window.innerHeight);
document.addEventListener('DOMContentLoaded', () => {
    const storedIndex = sessionStorage.getItem('currentSectionIndex');
    if (storedIndex !== null) {
        currentIndex = parseInt(storedIndex);
        sections[currentIndex].logo.style.transform = 'translateY(0)';
        sections[currentIndex].logo.style.opacity = '1';
    }
});
*/
