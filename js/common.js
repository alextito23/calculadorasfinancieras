// Common JavaScript functions for all pages

// Theme toggle
function toggleTheme() {
    var btn = document.getElementById('theme-toggle-btn');
    if (document.body.classList.contains('light-mode')) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        if(btn) btn.innerHTML = '☀️ Claro';
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        if(btn) btn.innerHTML = '🌙 Oscuro';
    }
}

// Mobile menu toggle - works with both toggleMenu and toggleMobileMenu
function toggleMenu() {
    var navList = document.getElementById('nav-list');
    var toggle = document.querySelector('.mobile-toggle') || document.getElementById('mobile-menu-toggle') || document.querySelector('.mobile-menu-toggle');
    if (navList) {
        if (navList.classList.contains('menu-open')) {
            navList.classList.remove('menu-open');
            if(toggle) {
                toggle.innerHTML = '☰ Menu';
                toggle.setAttribute('aria-expanded', 'false');
            }
        } else {
            navList.classList.add('menu-open');
            if(toggle) {
                toggle.innerHTML = '✕ Cerrar';
                toggle.setAttribute('aria-expanded', 'true');
            }
        }
    }
}

// Alias for toggleMobileMenu
function toggleMobileMenu() {
    toggleMenu();
}

// Init theme on load
(function() {
    var savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        var btn = document.getElementById('theme-toggle-btn');
        if(btn) btn.innerHTML = '🌙 Oscuro';
    }
})();
