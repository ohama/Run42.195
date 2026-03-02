// Add prev/next navigation to the top of the page
document.addEventListener('DOMContentLoaded', function() {
    // Find the existing nav-wrapper at the bottom
    var bottomNav = document.querySelector('.nav-wrapper');

    if (bottomNav) {
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
