// ui.js
export function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

export function toggleThemeDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    const themeButton = document.querySelector('.theme-btn');
    
    if (dropdown.classList.contains('hidden')) {
        // Get button position
        const buttonRect = themeButton.getBoundingClientRect();
        
        // Get viewport width
        const viewportWidth = window.innerWidth;
        
        // Calculate dropdown width (assuming it's the same as specified in CSS)
        const dropdownWidth = 192; // 12rem = 192px
        
        // Calculate the right edge position of the dropdown
        const dropdownRight = buttonRect.right;
        
        // If dropdown would go off-screen on the right, align it to the right edge of the button
        let leftPosition;
        if (dropdownRight + dropdownWidth > viewportWidth) {
            leftPosition = buttonRect.right - dropdownWidth;
        } else {
            leftPosition = buttonRect.left;
        }
        
        // Position dropdown
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${buttonRect.bottom + 8}px`; // 8px gap
        dropdown.style.left = `${leftPosition}px`;
        dropdown.style.zIndex = '9999';
        
        dropdown.classList.remove('hidden');
        dropdown.classList.add('dropdown-animate');
    } else {
        dropdown.classList.remove('dropdown-animate');
        dropdown.classList.add('hidden');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('theme-dropdown');
    const themeButton = event.target.closest('.theme-btn');
    
    if (!themeButton && !event.target.closest('#theme-dropdown') && !dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('dropdown-animate');
        dropdown.classList.add('hidden');
    }
});

// Add hover effect for the main theme button
const themeButton = document.querySelector('.theme-btn');
if (themeButton) {
    themeButton.addEventListener('mouseover', function() {
        this.querySelector('i').style.transform = 'rotate(180deg)';
    });

    themeButton.addEventListener('mouseout', function() {
        this.querySelector('i').style.transform = 'rotate(0deg)';
    });
}