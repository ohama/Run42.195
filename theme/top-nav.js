// Add prev/next navigation to the top of the page and home link
document.addEventListener('DOMContentLoaded', function() {
    // Find the existing nav-wrapper at the bottom
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
});

function addHomeLink(navWrapper) {
    // Create home link element
    var homeLink = document.createElement('a');
    homeLink.href = '/Run42.195/';
    homeLink.className = 'nav-home';
    homeLink.innerHTML = '<i class="fa fa-home"></i> Home';

    // Insert home link at the center of nav
    var navChapters = navWrapper.querySelector('.nav-chapters');
    if (navChapters) {
        // Find the spacer or create insertion point
        var rightNav = navWrapper.querySelector('.right-buttons, .nav-wide-wrapper .right');
        if (rightNav) {
            navChapters.insertBefore(homeLink, rightNav);
        } else {
            navChapters.appendChild(homeLink);
        }
    } else {
        // Fallback: insert as first child
        navWrapper.insertBefore(homeLink, navWrapper.firstChild);
    }
}
