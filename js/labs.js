import { filterLabsBySearch } from './labs-search.js';

async function loadLabs() {
  try {
    console.log('Attempting to fetch labs data...');
    const response = await fetch('js/data/labs.json');  // Remove leading slash for relative path
    
    if (!response.ok) {
      console.error('Failed to load labs data:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      throw new Error(`Failed to load labs data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully loaded labs data:', data);
    const labsContainer = document.querySelector('#labs-container');
    const slideDots = document.querySelector('#slide-dots');

    if (!labsContainer || !slideDots) {
      throw new Error('Required elements not found: ' + 
        (!labsContainer ? '#labs-container' : '') +
        (!slideDots ? '#slide-dots' : ''));
    }

    labsContainer.innerHTML = '';
    slideDots.innerHTML = '';

    // --- CATEGORY NAVIGATION ---
    const categoryNav = document.getElementById('labs-category-nav');
    // Get unique categories from labs data
    const categories = Array.from(new Set(data.labs.map(lab => lab.category)));
    categories.sort();
    categories.unshift('All');
    let selectedCategory = 'All';

    function renderCategoryNav() {
      categoryNav.innerHTML = '';
      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.className = `px-4 py-2 rounded-full font-semibold border border-[var(--border-color)] transition-all duration-200 ${selectedCategory === cat ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-md' : 'bg-[var(--bg-color)] text-[var(--text-color)] hover:bg-[var(--accent-light)]'}`;
        btn.addEventListener('click', () => {
          selectedCategory = cat;
          renderCategoryNav();
          renderLabs();
        });
        categoryNav.appendChild(btn);
      });
    }

    // --- LABS RENDERING WITH FILTER ---
    const searchInput = document.getElementById('labs-search-input');
    let searchValue = '';
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchValue = e.target.value.toLowerCase();
        renderLabs();
      });
    }
    function renderLabs() {
      labsContainer.innerHTML = '';
      slideDots.innerHTML = '';
      let filteredLabs = selectedCategory === 'All' ? data.labs : data.labs.filter(lab => lab.category === selectedCategory);
      // Apply search filter
      filteredLabs = filterLabsBySearch(filteredLabs, searchValue);
      let displayLabs = [...filteredLabs];
      // Add ghost cards if only one real card
      if (filteredLabs.length === 1) {
        displayLabs = [
          { ghost: true },
          filteredLabs[0],
          { ghost: true }
        ];
      }
      displayLabs.forEach((lab, index) => {
        const isLargeContent = lab && lab.name && lab.name.toLowerCase().includes('comppro ai');
        const isDesktop = window.innerWidth >= 1024;
        let extraTopMargin = '';
        if (isLargeContent && isDesktop) {
          extraTopMargin = ' mt-16';
        }
        const labCard = document.createElement('div');
        if (lab.ghost) {
          labCard.className = 'lab-card absolute w-[80vw] sm:w-[360px] max-w-[360px] mt-8 mb-8 pointer-events-none opacity-0';
          labCard.tabIndex = -1;
        } else {
          labCard.className = 'lab-card absolute w-[80vw] sm:w-[360px] max-w-[360px] bg-[var(--bg-color)] p-6 sm:p-8 rounded-3xl shadow-xl transition-all duration-700 ease-out border-2 border-[var(--border-color)] cursor-pointer hover:shadow-2xl hover:scale-[1.02] backdrop-blur-md bg-opacity-95 mt-8 mb-8' + extraTopMargin;
          labCard.innerHTML = `
            <div class="flex flex-col items-center text-center space-y-6">
              <div class="w-40 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-[var(--accent-color)]/20 to-[var(--accent-color)]/30 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform duration-300">
                ${lab.icon ? `<i class="${lab.icon} text-[var(--accent-color)] text-4xl sm:text-5xl"></i>` : (lab.image ? `<img src="${lab.image}" alt="${lab.name}" class="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl" />` : '')}
              </div>
              <div class="flex flex-col items-center gap-3">
                <h3 class="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--text-color)] tracking-tight">${lab.name}</h3>
                ${lab.active ? `<span class="inline-block px-4 sm:px-5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-[var(--accent-color)] bg-[var(--accent-light)]/30 rounded-full shadow-sm border border-[var(--accent-color)]/20">Active</span>` : ''}
              </div>
              <p class="text-[var(--text-color)] opacity-85 leading-relaxed text-sm md:text-base max-w-sm" title="${lab.description.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">
                ${lab.description.length > 100 ? lab.description.slice(0, 100) + '...' : lab.description}
              </p>
              <a href="${lab.url}" 
                 target="_blank"
                 class="group inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-[var(--accent-color)] text-[var(--bg-color)] font-bold rounded-xl shadow-lg hover:bg-[var(--accent-dark)] transform hover:translate-y-[-2px] transition-all duration-300">
                <i class="${lab.btnIcon} mr-2 sm:mr-3 group-hover:animate-pulse"></i>
                ${lab.btnText}
              </a>
            </div>
          `;
          labCard.dataset.index = index;
        }
        labsContainer.appendChild(labCard);
      });
      // Dots and card stack logic
      let cards = Array.from(labsContainer.children);
      let totalCards = cards.length;
      let currentIndex = 0;
      let autoSlideInterval;
      const visibleCards = 5;
      // Only show dots if more than 1 card
      if (totalCards > 1) {
        cards.forEach((_, index) => {
          const dot = document.createElement('button');
          dot.className = `w-2 sm:w-3 h-2 sm:h-3 rounded-full ${index === 0 ? 'bg-[var(--accent-color)]' : 'bg-gray-400'} hover:bg-[var(--accent-dark)] transition-all duration-300`;
          dot.addEventListener('click', () => goToSlide(index));
          slideDots.appendChild(dot);
        });
      }
      function updateCardStack() {
        const isMobile = window.innerWidth < 640;
        const containerWidth = labsContainer.offsetWidth;
        const maxSpacing = Math.min(containerWidth * 0.2, 140);
        const cardSpacing = isMobile ? Math.min(80, containerWidth * 0.15) : maxSpacing;
        cards.forEach((card, i) => {
          const offset = (i - currentIndex + totalCards) % totalCards;
          if (offset < visibleCards) {
            const zIndex = visibleCards - offset;
            let translateX = 0, translateY = 0, translateZ = 0, rotateY = 0, scale = 1, sideOffset = 0;
            if (offset === 0) {
              translateX = 0; translateY = -20; translateZ = 50; rotateY = 0; scale = 1;
            } else if (offset <= 2) {
              sideOffset = offset;
              translateX = cardSpacing * sideOffset;
              translateY = Math.abs(sideOffset) * 15;
              translateZ = -40 * Math.abs(sideOffset);
              rotateY = 12 * sideOffset;
              scale = Math.max(0.85, 1 - (Math.abs(sideOffset) * 0.1));
            } else {
              sideOffset = -(visibleCards - offset);
              translateX = cardSpacing * sideOffset;
              translateY = Math.abs(sideOffset) * 15;
              translateZ = -40 * Math.abs(sideOffset);
              rotateY = 12 * sideOffset;
              scale = Math.max(0.85, 1 - (Math.abs(sideOffset) * 0.1));
            }
            card.style.willChange = 'transform, opacity';
            card.style.transform = `
              translate3d(${translateX}px, ${translateY + Math.sin(Date.now()/1000)*3}px, ${translateZ}px)
              rotateY(${rotateY}deg) 
              rotateX(${offset === 0 ? Math.sin(Date.now()/1000)*1.5 : 0}deg)
              scale(${scale})
            `;
            card.style.zIndex = zIndex;
            card.style.opacity = offset === 0 ? 1 : Math.max(0.7, 1 - (Math.abs(sideOffset) * 0.15));
            card.style.transition = 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)';
            card.classList.remove('pointer-events-none');
          } else {
            const direction = offset < totalCards / 2 ? -containerWidth : containerWidth;
            card.style.transform = `
              translate3d(${direction}px, 0, -400px)
              scale(0.5)
            `;
            card.style.transition = 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.zIndex = -1;
            card.style.opacity = 0;
            card.classList.add('pointer-events-none');
          }
        });
        const dots = slideDots.children;
        Array.from(dots).forEach((dot, i) => {
          dot.className = `w-2 sm:w-3 h-2 sm:h-3 rounded-full ${i === currentIndex ? 'bg-[var(--accent-color)]' : 'bg-gray-400'} hover:bg-[var(--accent-dark)] transition-all duration-300`;
        });
      }
      function autoSlide() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCardStack();
      }
      function goToSlide(index) {
        clearInterval(autoSlideInterval);
        currentIndex = index;
        updateCardStack();
        autoSlideInterval = setInterval(autoSlide, 5000);
      }
      // Card click event
      cards.forEach(card => {
        card.addEventListener('click', () => {
          clearInterval(autoSlideInterval);
          const clickedIndex = parseInt(card.dataset.index);
          if (clickedIndex === currentIndex) {
            card.style.transform += ' rotateY(360deg)';
            setTimeout(() => { updateCardStack(); }, 700);
          } else {
            currentIndex = clickedIndex;
            updateCardStack();
          }
          autoSlideInterval = setInterval(autoSlide, 5000);
        });
      });
      // Only enable stack/slide if more than 1 card
      if (totalCards > 1) {
        updateCardStack();
        autoSlideInterval = setInterval(autoSlide, 5000);
        labsContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        labsContainer.addEventListener('mouseleave', () => {
          autoSlideInterval = setInterval(autoSlide, 5000);
        });
      } else {
        // For single card, reset transform and opacity
        if (cards[0]) {
          cards[0].style.transform = '';
          cards[0].style.opacity = 1;
          cards[0].style.zIndex = 1;
        }
      }
      // Prevent scroll when mouse is over a lab card
      cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
          labsContainer.addEventListener('wheel', preventScroll, { passive: false });
          labsContainer.addEventListener('touchmove', preventScroll, { passive: false });
        });
        card.addEventListener('mouseleave', (e) => {
          labsContainer.removeEventListener('wheel', preventScroll, { passive: false });
          labsContainer.removeEventListener('touchmove', preventScroll, { passive: false });
        });
      });
    }

    renderCategoryNav();
    renderLabs();

    function preventScroll(e) {
      e.preventDefault();
    }

  } catch (error) {
    console.error('Detailed error loading labs:', {
      message: error.message,
      stack: error.stack
    });
    const labsContainer = document.querySelector('#labs-container');
    if (labsContainer) {
      labsContainer.innerHTML = `
        <div class="text-center">
          <p class="text-[var(--text-color)] opacity-60 mb-4">Failed to load labs. Please try again later.</p>
          <p class="text-[var(--text-color)] opacity-40 text-sm">${error.message}</p>
        </div>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', loadLabs);