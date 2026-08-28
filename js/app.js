// App Logic for "Player 2" — Curated Co-Op Games Lounge

document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    games: [...GAMES_DATA],
    statusFilter: 'all',
    vibeFilter: 'all',
    searchQuery: '',
    wishlist: loadWishlist(),
    customGames: loadCustomGames(),
    isSpinning: false
  };

  // Combine default games with any custom saved games
  if (state.customGames.length > 0) {
    state.games = [...state.customGames, ...GAMES_DATA];
  }

  // DOM Elements
  const gamesGrid = document.getElementById('gamesGrid');
  const searchInput = document.getElementById('searchInput');
  const statusFilterBtns = document.querySelectorAll('.status-tab-btn');
  const vibeChips = document.querySelectorAll('.vibe-chip');
  const resultsCount = document.getElementById('resultsCount');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  
  // Wishlist Elements
  const wishlistCountBadges = document.querySelectorAll('.wishlist-count-badge');
  const wishlistDrawerBackdrop = document.getElementById('wishlistDrawerBackdrop');
  const openWishlistBtn = document.getElementById('openWishlistBtn');
  const floatingWishlistBtn = document.getElementById('floatingWishlistBtn');
  const closeWishlistDrawerBtn = document.getElementById('closeWishlistDrawerBtn');
  const wishlistItemsContainer = document.getElementById('wishlistItemsContainer');
  const copyWishlistBtn = document.getElementById('copyWishlistBtn');

  // Modals
  const gameDetailModal = document.getElementById('gameDetailModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalHeroImg = document.getElementById('modalHeroImg');
  const modalGameTitle = document.getElementById('modalGameTitle');
  const modalGameSubtitle = document.getElementById('modalGameSubtitle');
  const modalBadgeStatus = document.getElementById('modalBadgeStatus');
  const modalPitchText = document.getElementById('modalPitchText');
  const modalSummaryText = document.getElementById('modalSummaryText');
  const modalPaceRating = document.getElementById('modalPaceRating');
  const modalSnackRating = document.getElementById('modalSnackRating');
  const modalBeginnerRating = document.getElementById('modalBeginnerRating');
  const modalThingsList = document.getElementById('modalThingsList');
  const modalTrailerContainer = document.getElementById('modalTrailerContainer');
  const modalWishlistBtn = document.getElementById('modalWishlistBtn');
  const modalSteamBtn = document.getElementById('modalSteamBtn');

  // Roulette Modal
  const rouletteModal = document.getElementById('rouletteModal');
  const openRouletteBtn = document.getElementById('openRouletteBtn');
  const closeRouletteBtn = document.getElementById('closeRouletteBtn');
  const spinRouletteBtn = document.getElementById('spinRouletteBtn');
  const rouletteTitle = document.getElementById('rouletteTitle');
  const rouletteSubtitle = document.getElementById('rouletteSubtitle');
  const roulettePitch = document.getElementById('roulettePitch');
  const rouletteViewDetailsBtn = document.getElementById('rouletteViewDetailsBtn');

  // Suggest / Add Game Modal
  const addGameModal = document.getElementById('addGameModal');
  const openAddGameBtn = document.getElementById('openAddGameBtn');
  const closeAddGameBtn = document.getElementById('closeAddGameBtn');
  const addGameForm = document.getElementById('addGameForm');

  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  let currentSelectedGameId = null;
  let rouletteSelectedGameId = null;

  // Initialize
  init();

  function init() {
    setupEventListeners();
    updateWishlistBadges();
    renderGames();
  }

  function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.toLowerCase().trim();
      renderGames();
    });

    // Status filter buttons
    statusFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        statusFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.statusFilter = btn.dataset.status;
        renderGames();
      });
    });

    // Vibe filter chips
    vibeChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        vibeChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        state.vibeFilter = chip.dataset.vibe;
        renderGames();
      });
    });

    // Clear filters
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        state.searchQuery = '';
        state.statusFilter = 'all';
        state.vibeFilter = 'all';
        searchInput.value = '';
        statusFilterBtns.forEach((b) => b.classList.toggle('active', b.dataset.status === 'all'));
        vibeChips.forEach((c) => c.classList.toggle('active', c.dataset.vibe === 'all'));
        renderGames();
      });
    }

    // Wishlist Drawer toggles
    if (openWishlistBtn) openWishlistBtn.addEventListener('click', openWishlistDrawer);
    if (floatingWishlistBtn) floatingWishlistBtn.addEventListener('click', openWishlistDrawer);
    if (closeWishlistDrawerBtn) closeWishlistDrawerBtn.addEventListener('click', closeWishlistDrawer);
    if (wishlistDrawerBackdrop) {
      wishlistDrawerBackdrop.addEventListener('click', (e) => {
        if (e.target === wishlistDrawerBackdrop) closeWishlistDrawer();
      });
    }

    // Copy Wishlist Button
    if (copyWishlistBtn) {
      copyWishlistBtn.addEventListener('click', copyWishlistToClipboard);
    }

    // Modal Close
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeGameModal);
    if (gameDetailModal) {
      gameDetailModal.addEventListener('click', (e) => {
        if (e.target === gameDetailModal) closeGameModal();
      });
    }

    // Modal Wishlist button
    if (modalWishlistBtn) {
      modalWishlistBtn.addEventListener('click', () => {
        if (currentSelectedGameId) {
          toggleWishlist(currentSelectedGameId);
          updateModalWishlistState(currentSelectedGameId);
        }
      });
    }

    // Roulette triggers
    if (openRouletteBtn) openRouletteBtn.addEventListener('click', openRoulette);
    if (closeRouletteBtn) closeRouletteBtn.addEventListener('click', closeRoulette);
    if (rouletteModal) {
      rouletteModal.addEventListener('click', (e) => {
        if (e.target === rouletteModal) closeRoulette();
      });
    }
    if (spinRouletteBtn) spinRouletteBtn.addEventListener('click', spinRoulette);
    if (rouletteViewDetailsBtn) {
      rouletteViewDetailsBtn.addEventListener('click', () => {
        if (rouletteSelectedGameId) {
          closeRoulette();
          openGameModal(rouletteSelectedGameId);
        }
      });
    }

    // Suggest Game Form
    if (openAddGameBtn) openAddGameBtn.addEventListener('click', () => addGameModal.classList.add('active'));
    if (closeAddGameBtn) closeAddGameBtn.addEventListener('click', () => addGameModal.classList.remove('active'));
    if (addGameModal) {
      addGameModal.addEventListener('click', (e) => {
        if (e.target === addGameModal) addGameModal.classList.remove('active');
      });
    }
    if (addGameForm) {
      addGameForm.addEventListener('submit', handleAddGameSubmit);
    }

    // Keyboard ESC listener for all modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeGameModal();
        closeRoulette();
        closeWishlistDrawer();
        if (addGameModal) addGameModal.classList.remove('active');
      }
    });
  }

  // Filter & Render
  function renderGames() {
    const filtered = state.games.filter((game) => {
      // Status match
      if (state.statusFilter !== 'all' && game.status !== state.statusFilter) {
        return false;
      }
      // Vibe match
      if (state.vibeFilter !== 'all' && game.vibeCategory !== state.vibeFilter) {
        return false;
      }
      // Search match
      if (state.searchQuery) {
        const q = state.searchQuery;
        const inTitle = game.title.toLowerCase().includes(q);
        const inSubtitle = game.subtitle.toLowerCase().includes(q);
        const inPitch = game.pitch.toLowerCase().includes(q);
        const inTags = game.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inSubtitle && !inPitch && !inTags) {
          return false;
        }
      }
      return true;
    });

    resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'game' : 'games'}`;

    if (filtered.length === 0) {
      gamesGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎮🔍</div>
          <h3>No games match your current filter</h3>
          <p>Try switching categories or clearing your search term to see more fun options.</p>
          <button class="btn-wishlist-view" style="margin-top: 1rem;" onclick="document.getElementById('clearFiltersBtn').click()">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    gamesGrid.innerHTML = filtered.map((game) => createGameCardHTML(game)).join('');

    // Attach card action listeners
    attachCardListeners();
  }

  function createGameCardHTML(game) {
    const isBookmarked = state.wishlist.includes(game.id);
    const isReleased = game.status === 'released';

    return `
      <div class="game-card" data-id="${game.id}">
        <div class="card-media-wrapper">
          <img 
            class="card-media-img" 
            src="${game.bannerImage}" 
            alt="${game.title}" 
            loading="lazy"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';"
          />
          <div class="card-media-overlay"></div>
          
          <span class="card-badge-status ${isReleased ? 'badge-released' : 'badge-upcoming'}">
            ${isReleased ? '🟢 Ready Now' : '🔮 Upcoming'}
          </span>

          <span class="card-badge-vibe">${game.vibeCategoryName}</span>

          <button 
            class="btn-bookmark-card ${isBookmarked ? 'bookmarked' : ''}" 
            data-id="${game.id}" 
            title="${isBookmarked ? 'In Wishlist' : 'Add to Wishlist'}"
            aria-label="Wishlist toggle"
          >
            ${isBookmarked ? '💖' : '🤍'}
          </button>
        </div>

        <div class="card-content">
          <div class="card-title-group">
            <h3 class="card-title">${game.title}</h3>
            <p class="card-subtitle">${game.subtitle}</p>
          </div>

          <div class="card-pitch">
            <span class="pitch-quote-mark">“</span>${game.pitch}<span class="pitch-quote-mark">”</span>
          </div>

          <div class="card-specs-row">
            <div class="card-spec-item">
              <span class="card-spec-label">Pace:</span>
              <span>${game.paceRating}</span>
            </div>
            <div class="card-spec-item">
              <span class="card-spec-label">Break Friendliness:</span>
              <span>${game.snackFriendliness}</span>
            </div>
          </div>

          <div class="card-tags">
            ${game.tags.slice(0, 3).map((tag) => `<span class="card-tag">#${tag}</span>`).join('')}
          </div>

          <div class="card-footer">
            <button class="btn-card-details" data-id="${game.id}">
              <span>✨ Explore Details & Video</span>
            </button>
            <a 
              href="${game.steamUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn-card-steam" 
              title="View on Steam / Official Site"
            >
              🔗
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function attachCardListeners() {
    // Card detail buttons
    document.querySelectorAll('.btn-card-details').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        openGameModal(id);
      });
    });

    // Card bookmark buttons
    document.querySelectorAll('.btn-bookmark-card').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        toggleWishlist(id);
      });
    });
  }

  // Game Detail Modal
  function openGameModal(gameId) {
    const game = state.games.find((g) => g.id === gameId);
    if (!game) return;

    currentSelectedGameId = game.id;

    modalHeroImg.src = game.bannerImage;
    modalHeroImg.onerror = function() {
      this.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
    };

    modalGameTitle.textContent = game.title;
    modalGameSubtitle.textContent = game.subtitle;
    modalBadgeStatus.textContent = game.statusText;
    modalBadgeStatus.className = `card-badge-status ${game.status === 'released' ? 'badge-released' : 'badge-upcoming'}`;
    
    modalPitchText.textContent = game.pitch;
    modalSummaryText.textContent = game.plainSummary;
    modalPaceRating.textContent = game.paceRating;
    modalSnackRating.textContent = game.snackFriendliness;
    modalBeginnerRating.textContent = game.beginnerFriendliness;

    // Render "Things We Can Do"
    modalThingsList.innerHTML = game.thingsWeCanDo.map((item) => `
      <li>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${item}</span>
      </li>
    `).join('');

    // Render Video Trailer Embed (Responsive YouTube Embed)
    if (game.trailerVideoId) {
      modalTrailerContainer.innerHTML = `
        <div class="modal-trailer-wrapper">
          <iframe 
            src="https://www.youtube-nocookie.com/embed/${game.trailerVideoId}?rel=0" 
            title="${game.title} Trailer" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>
      `;
    } else {
      modalTrailerContainer.innerHTML = '';
    }

    modalSteamBtn.href = game.steamUrl;
    updateModalWishlistState(game.id);

    gameDetailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGameModal() {
    gameDetailModal.classList.remove('active');
    document.body.style.overflow = '';
    // Clear iframe to stop video playback
    if (modalTrailerContainer) {
      modalTrailerContainer.innerHTML = '';
    }
  }

  function updateModalWishlistState(gameId) {
    const isBookmarked = state.wishlist.includes(gameId);
    if (isBookmarked) {
      modalWishlistBtn.classList.add('active');
      modalWishlistBtn.innerHTML = '<span>💖 In Our Wishlist</span>';
    } else {
      modalWishlistBtn.classList.remove('active');
      modalWishlistBtn.innerHTML = '<span>🤍 Add to Our Wishlist</span>';
    }
  }

  // Wishlist Storage & Actions
  function toggleWishlist(gameId) {
    const index = state.wishlist.indexOf(gameId);
    let added = false;
    if (index === -1) {
      state.wishlist.push(gameId);
      added = true;
      showToast('💖 Added to our Wishlist!');
    } else {
      state.wishlist.splice(index, 1);
      showToast('🤍 Removed from Wishlist');
    }

    saveWishlist(state.wishlist);
    updateWishlistBadges();
    renderGames();
    renderWishlistDrawerItems();
  }

  function updateWishlistBadges() {
    const count = state.wishlist.length;
    wishlistCountBadges.forEach((badge) => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });

    if (floatingWishlistBtn) {
      floatingWishlistBtn.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function openWishlistDrawer() {
    renderWishlistDrawerItems();
    wishlistDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlistDrawer() {
    wishlistDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderWishlistDrawerItems() {
    const bookmarkedGames = state.games.filter((g) => state.wishlist.includes(g.id));

    if (bookmarkedGames.length === 0) {
      wishlistItemsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">💌</div>
          <p>No games bookmarked yet!</p>
          <p style="font-size: 0.85rem; margin-top: 0.25rem;">Tap the heart icon on any game that catches your eye.</p>
        </div>
      `;
      copyWishlistBtn.style.display = 'none';
      return;
    }

    copyWishlistBtn.style.display = 'flex';
    wishlistItemsContainer.innerHTML = bookmarkedGames.map((game) => `
      <div class="drawer-item">
        <div>
          <div class="drawer-item-title">${game.title}</div>
          <div class="drawer-item-vibe">${game.vibeCategoryName} • ${game.paceRating}</div>
        </div>
        <button class="btn-remove-wishlist" data-id="${game.id}" title="Remove">✕</button>
      </div>
    `).join('');

    // Attach remove listeners
    wishlistItemsContainer.querySelectorAll('.btn-remove-wishlist').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        toggleWishlist(id);
      });
    });
  }

  function copyWishlistToClipboard() {
    const bookmarkedGames = state.games.filter((g) => state.wishlist.includes(g.id));
    if (bookmarkedGames.length === 0) return;

    let text = `🎮 Our Co-Op Date Night Wishlist:\n\n`;
    bookmarkedGames.forEach((game, i) => {
      text += `${i + 1}. **${game.title}** (${game.vibeCategoryName})\n`;
      text += `   - Why it looks fun: "${game.pitch}"\n`;
      text += `   - Status: ${game.statusText}\n\n`;
    });
    text += `💖 Whenever you feel like playing, I'm ready! (Or we can just chill!)`;

    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Copied date ideas to clipboard!');
    }).catch(() => {
      showToast('📋 Saved to clipboard!');
    });
  }

  // Date Night Roulette (Random Adventure Picker)
  function openRoulette() {
    rouletteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    spinRoulette();
  }

  function closeRoulette() {
    rouletteModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function spinRoulette() {
    if (state.isSpinning) return;
    state.isSpinning = true;

    rouletteTitle.textContent = '✨ Picking an adventure...';
    rouletteSubtitle.textContent = 'Shuffling through our catalog...';
    roulettePitch.textContent = 'Searching for the perfect vibe for tonight...';
    rouletteViewDetailsBtn.style.display = 'none';

    let counter = 0;
    const totalFlips = 16;
    const interval = setInterval(() => {
      const randomGame = state.games[Math.floor(Math.random() * state.games.length)];
      rouletteTitle.textContent = randomGame.title;
      rouletteSubtitle.textContent = randomGame.subtitle;
      counter++;

      if (counter >= totalFlips) {
        clearInterval(interval);
        state.isSpinning = false;
        
        // Final Pick
        const chosen = state.games[Math.floor(Math.random() * state.games.length)];
        rouletteSelectedGameId = chosen.id;

        rouletteTitle.textContent = `🎉 ${chosen.title}`;
        rouletteSubtitle.textContent = chosen.subtitle;
        roulettePitch.innerHTML = `<strong>Why tonight:</strong> “${chosen.pitch}”`;
        rouletteViewDetailsBtn.style.display = 'inline-flex';
        
        triggerCelebration();
      }
    }, 100);
  }

  function triggerCelebration() {
    // If canvas confetti is available
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // Suggest / Add Custom Game
  function handleAddGameSubmit(e) {
    e.preventDefault();
    const titleInput = document.getElementById('customGameTitle');
    const pitchInput = document.getElementById('customGamePitch');
    const vibeInput = document.getElementById('customGameVibe');

    const newGame = {
      id: 'custom-' + Date.now(),
      title: titleInput.value.trim(),
      subtitle: 'Added by Us',
      status: 'released',
      statusText: 'Custom Suggestion',
      releaseInfo: 'Any Platform',
      steamUrl: 'https://store.steampowered.com/',
      trailerVideoId: '',
      bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      vibeCategory: vibeInput.value,
      vibeCategoryName: getVibeName(vibeInput.value),
      paceRating: '🌿 As Relaxed as You Want',
      snackFriendliness: '☕ 10/10 — Total freedom',
      beginnerFriendliness: '🌟 Hand-picked by us',
      tags: ['Custom Suggestion', 'Date Night', 'Our Choice'],
      pitch: pitchInput.value.trim() || 'A great game we want to try whenever the mood is right!',
      plainSummary: 'A custom addition to our shared co-op gaming bucket list.',
      thingsWeCanDo: [
        'Play together at our own pace',
        'Have fun exploring with zero pressure',
        'Enjoy a relaxed date night session'
      ]
    };

    state.customGames.push(newGame);
    saveCustomGames(state.customGames);
    state.games.unshift(newGame);

    // Auto-wishlist it
    if (!state.wishlist.includes(newGame.id)) {
      state.wishlist.push(newGame.id);
      saveWishlist(state.wishlist);
      updateWishlistBadges();
    }

    addGameForm.reset();
    addGameModal.classList.remove('active');
    renderGames();
    showToast('✨ Added your game to our list!');
  }

  function getVibeName(vibe) {
    switch(vibe) {
      case 'cozy': return '🛋️ Cozy & Relaxed';
      case 'puzzles': return '🧩 Puzzles & Big Brain';
      case 'building': return '🏰 Building & Creating';
      case 'chaos': return '🛒 Pure Fun & Chaos';
      case 'adventure': return '⚔️ Epic Adventures & Sci-Fi';
      default: return '🎮 Co-Op Fun';
    }
  }

  // Toast Notification
  let toastTimer = null;
  function showToast(msg) {
    if (!toastNotification) return;
    toastMessage.textContent = msg;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3000);
  }

  // LocalStorage Helpers
  function loadWishlist() {
    try {
      const saved = localStorage.getItem('our_coop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  function saveWishlist(list) {
    try {
      localStorage.setItem('our_coop_wishlist', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }

  function loadCustomGames() {
    try {
      const saved = localStorage.getItem('our_coop_custom_games');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  function saveCustomGames(list) {
    try {
      localStorage.setItem('our_coop_custom_games', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  }
});
