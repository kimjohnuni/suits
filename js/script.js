





const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const dropdownTrigger = document.querySelector('.dropdown-trigger');
const dropdownContent = document.querySelector('.dropdown-content');
const menuItems = document.querySelectorAll('.menu-item, .dropdown-content a');
let isAnimating = false;

function toggleBodyScroll(disable) {
    document.body.style.overflow = disable ? 'hidden' : '';
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    toggleBodyScroll(false);
    setTimeout(() => {
        mobileMenu.style.display = 'none';
        dropdownTrigger.closest('.dropdown').classList.remove('active');
        dropdownContent.style.maxHeight = null;
        isAnimating = false;
    }, 300);
}

hamburger.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    if (!mobileMenu.classList.contains('active')) {
        mobileMenu.style.display = 'flex';
        requestAnimationFrame(() => {
            mobileMenu.classList.add('active');
            toggleBodyScroll(true);
            setTimeout(() => {
                isAnimating = false;
            }, 300);
        });
    } else {
        closeMenu();
    }
});

dropdownTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    const dropdown = dropdownTrigger.closest('.dropdown');
    dropdown.classList.toggle('active');

    if (dropdown.classList.contains('active')) {
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
    } else {
        dropdownContent.style.maxHeight = null;
    }
});

menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        if (href !== '#') {
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

document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
        closeMenu();
    }
});









/* NAV BAR ANIMATION ON SCROLL*/

const mainLogo = document.querySelector('.main-logo');
const artistStatementLogo = document.querySelector('.artist-statement-logo');
const busanLogo = document.querySelector('.busan-logo');
const hongkongLogo = document.querySelector('.hongkong-logo');
const icelandLogo = document.querySelector('.iceland-logo');
const myanmarLogo = document.querySelector('.myanmar-logo');
const peruLogo = document.querySelector('.peru-logo');
const manilaLogo = document.querySelector('.manila-logo');
const seoulLogo = document.querySelector('.seoul-logo');
const singaporeLogo = document.querySelector('.singapore-logo');
const tibetLogo = document.querySelector('.tibet-logo');

// Disable CSS smooth scrolling
document.documentElement.style.scrollBehavior = 'auto';

// Section mappings
const sections = [
    { logo: mainLogo, section: document.querySelector('.video-container') },
    { logo: artistStatementLogo, section: document.querySelector('#artist-statement') },
    { logo: busanLogo, section: document.querySelector('#busan-section') },
    { logo: hongkongLogo, section: document.querySelector('#hongkong-section') },
    { logo: icelandLogo, section: document.querySelector('#iceland-section') },
    { logo: myanmarLogo, section: document.querySelector('#myanmar-section') },
    { logo: peruLogo, section: document.querySelector('#peru-section') },
    { logo: manilaLogo, section: document.querySelector('#manila-section') },
    { logo: seoulLogo, section: document.querySelector('#seoul-section') },
    { logo: singaporeLogo, section: document.querySelector('#singapore-section') },
    { logo: tibetLogo, section: document.querySelector('#tibet-section') }
];

// Global variables
let currentIndex = 0;
let lastScrollY = window.scrollY;
let viewportHeight = window.innerHeight;

// Initialize the current section
function initializeCurrentSection() {
    sections.forEach(({logo}) => {
        logo.style.transform = 'translateY(-20%)'; // Start off-screen
        logo.style.opacity = '0'; // Initially hidden
    });

    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].section.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.3 && rect.bottom >= viewportHeight * 0.3) {
            currentIndex = i;
            sessionStorage.setItem('currentSectionIndex', i);
            sections[i].logo.style.transform = 'translateY(0)'; // Bring into view
            sections[i].logo.style.opacity = '1'; // Make visible
            break;
        }
    }
}

// Set the initial state based on session storage
function setInitialState() {
    const storedIndex = sessionStorage.getItem('currentSectionIndex');

    if (storedIndex !== null) {
        currentIndex = parseInt(storedIndex);
        sections.forEach(({logo}) => {
            logo.style.transform = 'translateY(-20%)'; // Start off-screen
            logo.style.opacity = '0'; // Initially hidden
        });
        sections[currentIndex].logo.style.transform = 'translateY(0)'; // Bring into view
        sections[currentIndex].logo.style.opacity = '1'; // Make visible
    } else {
        initializeCurrentSection();
    }
}

// Animate the transition between logos
function animateLogoTransition(fromLogo, toLogo, direction) {
    const animationDuration = 300; // Duration in milliseconds

    fromLogo.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: `translateY(${direction === 'down' ? '20%' : '-20%'})`, opacity: 0 }
    ], {
        duration: animationDuration,
        fill: 'forwards'
    });

    toLogo.animate([
        { transform: `translateY(${direction === 'down' ? '-20%' : '20%'})`, opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
    ], {
        duration: animationDuration,
        fill: 'forwards'
    });
}

// Handle scroll events to trigger animations
function handleScroll() {
    const scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';

    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].section.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.3 && rect.bottom >= viewportHeight * 0.3) {
            if (i !== currentIndex) {
                animateLogoTransition(sections[currentIndex].logo, sections[i].logo, scrollDirection);
                currentIndex = i;
                sessionStorage.setItem('currentSectionIndex', i);
            }
            break;
        }
    }
    lastScrollY = window.scrollY;
}

// Event Listeners for smooth scrolling on anchor clicks
document.querySelectorAll('.menu a, .mobile-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if(targetSection) {
                const offsetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - 50;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                const mobileMenu = document.querySelector('.mobile-menu');
                if(mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        }
    });
});

// Update viewport height on resize
window.addEventListener('resize', () => {
    viewportHeight = window.innerHeight;
});

// Handle scroll events using requestAnimationFrame for performance
window.addEventListener('scroll', () => {
    requestAnimationFrame(handleScroll);
});

// Initialize on page load with DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setInitialState();
});












/*PORTRAITS HEADER FADE*/
/*
window.addEventListener('scroll', function() {
    const title = document.querySelector('.busan-portraits h2');
    const section = document.querySelector('.busan-portraits');
    const sectionTop = section.getBoundingClientRect().top;

    // Start fading when section is 200px from top
    let opacity = sectionTop / 800;
    opacity = Math.max(0, Math.min(1, opacity)); // Clamp between 0 and 1

    title.style.opacity = opacity;
});






/*IMAGE PLACEHOLDERS*/
/*
document.querySelectorAll('.busan-portraits__gallery img').forEach(img => {
    // Set fixed dimensions before loading
    const aspectRatio = 1; // Adjust this based on your image ratio
    img.style.height = (img.offsetWidth * aspectRatio) + 'px';

    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});
*/
