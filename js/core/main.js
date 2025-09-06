// main.js
import { CONFIG } from '../core/config.js';
import { applyTheme } from '../core/color-theme.js';
import { toggleMenu, toggleThemeDropdown } from '../core/ui.js';
import { toggleRainEffect } from '../rain.js';

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selected-theme') || CONFIG.DEFAULT_THEME;
    applyTheme(savedTheme);
});

// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 800);
});

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollPx / winHeightPx) * 100;
    
    scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
});

// Navbar Scroll Effect
const navbar = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Expose functions globally for use in HTML event handlers
window.applyTheme = applyTheme;
window.toggleMenu = toggleMenu;
window.toggleThemeDropdown = toggleThemeDropdown;
window.toggleRainEffect = toggleRainEffect;

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add aria-labels and roles
    const navItems = document.querySelectorAll('nav a');
    navItems.forEach(item => {
        item.setAttribute('role', 'menuitem');
        if (!item.getAttribute('aria-label')) {
            item.setAttribute('aria-label', item.textContent.trim());
        }
    });

    // Make theme toggle button accessible
    const themeBtn = document.querySelector('.theme-btn');
    if (themeBtn) {
        themeBtn.setAttribute('aria-label', 'Toggle theme');
        themeBtn.setAttribute('role', 'button');
    }

    // Add keyboard navigation for theme dropdown
    const themeDropdown = document.getElementById('theme-dropdown');
    if (themeDropdown) {
        const themeOptions = themeDropdown.querySelectorAll('button');
        
        themeOptions.forEach((option, index) => {
            option.addEventListener('keydown', (e) => {
                let targetOption;
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        targetOption = themeOptions[index + 1] || themeOptions[0];
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        targetOption = themeOptions[index - 1] || themeOptions[themeOptions.length - 1];
                        break;
                    case 'Escape':
                        e.preventDefault();
                        themeDropdown.classList.add('hidden');
                        themeBtn?.focus();
                        break;
                }
                
                targetOption?.focus();
            });
        });
    }

    // Add skip to main content link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Enhance focus styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
});

// Enhance button and link interactions
document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a');
    if (target) {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        target.appendChild(ripple);
        
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => ripple.remove(), 600);
    }
});