// Add prev/next navigation to the top of the page and home link
document.addEventListener('DOMContentLoaded', function() {
    // Find the existing nav-wrapper at the bottom (mobile nav)
    var bottomNav = document.querySelector('.nav-wrapper');

    if (bottomNav) {
        // Add home link to bottom nav
        addHomeLink(bottomNav);

        // Clone the navigation
        var topNav = bottomNav.cloneNode(true);
        topNav.classList.add('top-nav');

        // Find the main content area
        var main = document.querySelector('.content main');

        if (main && main.firstChild) {
            // Insert the cloned nav at the top of main content
            main.insertBefore(topNav, main.firstChild);
        }
    }

    // Also add home link to wide nav (desktop)
    var wideNav = document.querySelector('.nav-wide-wrapper');
    if (wideNav) {
        addHomeLinkWide(wideNav);
    }
});

function addHomeLink(navWrapper) {
    // Create home link element
    var homeLink = document.createElement('a');
    homeLink.href = '/Run42.195/';
    homeLink.className = 'nav-home';
    homeLink.innerHTML = 'Home';

    // Find the clear div and insert before it
    var clearDiv = navWrapper.querySelector('div[style*="clear"]');
    if (clearDiv) {
        navWrapper.insertBefore(homeLink, clearDiv);
    } else {
        navWrapper.appendChild(homeLink);
    }
}

function addHomeLinkWide(navWrapper) {
    // Create home link element for wide nav
    var homeLink = document.createElement('a');
    homeLink.href = '/Run42.195/';
    homeLink.className = 'nav-home nav-home-wide';
    homeLink.innerHTML = 'Home';

    // Insert at the center
    navWrapper.appendChild(homeLink);
}
