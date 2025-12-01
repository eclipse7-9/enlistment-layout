// manual.js: toggle sidebar and overlay for manual pages (index uses this)
(function () {
  // Support multiple toggle buttons and an overlay element
  const toggles = document.querySelectorAll('#sidebarToggle, .sidebar-toggle-btn');
  const overlay = document.getElementById('manualOverlay') || document.querySelector('.overlay');

  // Start with overlay mode enabled so the sidebar is hidden by default
  if (!document.body.classList.contains('manual-overlay')) {
    document.body.classList.add('manual-overlay');
  }

  function openSidebar() {
    document.body.classList.add('sidebar-open');
  }
  function closeSidebar() {
    // Only remove the 'sidebar-open' flag so the overlay mode remains enabled
    document.body.classList.remove('sidebar-open');
  }

  toggles.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = document.body.classList.contains('sidebar-open');
      if (isOpen) closeSidebar(); else openSidebar();
    });
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeSidebar();
    });
  }

  // Close sidebar on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });
})();
