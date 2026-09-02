/**
 * Gillian Rozario - Portfolio JavaScript
 * Provides smooth navigation, mobile menu drawer, active link observer, and clipboard utility.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close mobile nav when clicking a nav link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    navMenu.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close mobile nav when clicking outside header
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 3. Active Navigation Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // 4. Copy to Clipboard Utility with Toast
    const copyButtons = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        const originalText = btn.textContent;
                        btn.textContent = 'Copied!';
                        showToast(`Copied "${textToCopy}" to clipboard`);
                        setTimeout(() => {
                            btn.textContent = originalText;
                        }, 2000);
                    })
                    .catch(() => {
                        // Fallback for older browsers
                        const textarea = document.createElement('textarea');
                        textarea.value = textToCopy;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        showToast(`Copied to clipboard`);
                    });
            }
        });
    });
});
