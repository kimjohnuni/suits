// --- LENIS INITIALIZATION --- //
let lenis;
document.addEventListener('DOMContentLoaded', function () {
  lenis = new Lenis({
    lerp: 0.08 // adjust for scroll feel
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});

// Function to handle all anchor clicks
function handleAnchorClick(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
        const element = document.querySelector(href);
        if (element && lenis) {
            lenis.scrollTo(element);
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
        if (mobileSprite) {
            const spriteUrl = window.getComputedStyle(mobileSprite)
                .backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            if (spriteUrl) {
                const img = new Image();
                img.onload = () => {
                    preloader.style.transition = 'opacity 0.8s ease';
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        mobileSprite.style.transition = 'opacity 0.8s ease';
                        mobileSprite.style.opacity = '1';
                    }, 800);
                };
                img.src = spriteUrl;
            } else {
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

window.addEventListener('resize', function () {
    if (window.innerWidth <= 576) {
        if (video) video.style.opacity = '0';
        if (mobileSprite) mobileSprite.style.opacity = '1';
    } else {
        if (mobileSprite) mobileSprite.style.opacity = '0';
        if (video) video.style.opacity = '1';
    }
});

/* MOBILE MENU */
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

        this.elements.mobileBottomLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#') && lenis) {
                    e.preventDefault();
                    lenis.scrollTo(document.querySelector(href));
                    this.closeMenu();
                }
            });
        });

        if (this.elements.bottomNavDropdownContent) {
            const dropdownLinks = this.elements.bottomNavDropdownContent.querySelectorAll('a');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.elements.bottomNavDropdownContent.style.display = 'none';
                });
            });
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
                if (href.startsWith('#') && href !== '#' && lenis) {
                    e.preventDefault();
                    lenis.scrollTo(document.querySelector(href));
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

/* -------- Remaining code untouched: modals, contact form (not related to scrolling) --------- */

// ... (rest of your code remains unchanged)
