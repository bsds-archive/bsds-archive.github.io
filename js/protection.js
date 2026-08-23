/* =====================================================================
   BSDS ARCHIVE — PAGE PROTECTION (OPTIONAL)
   =====================================================================
   Small deterrents against casual right-click-saving / view-source
   poking around. Toggle any of these off by flipping the flags below.

   Honest caveat: none of this is real security. Anyone who actually
   wants the HTML, a PDF's raw file, or your JS can still get it —
   view-source still works by typing it in the address bar, devtools
   can be opened from the browser's own menu, and every PDF is a plain
   file sitting at a public URL no matter what this script does. This
   only stops the casual right-click.

   Don't add this to viewer.html — it would block the text selection
   the PDF search/copy feature (in js/app.js) depends on.
   ===================================================================== */

const PROTECTION_SETTINGS = {
  disableRightClick: true,
  disableDevToolsShortcuts: true,   // F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U
  disableTextSelection: false,      // off by default — breaks copy/paste of real content
  disableImageDragging: true,
};

(function () {
  const s = PROTECTION_SETTINGS;

  if (s.disableRightClick) {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  if (s.disableDevToolsShortcuts) {
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const blocked =
        key === 'f12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key)) ||
        ((e.ctrlKey || e.metaKey) && key === 'u');
      if (blocked) e.preventDefault();
    });
  }

  if (s.disableTextSelection) {
    document.documentElement.style.userSelect = 'none';
    document.documentElement.style.webkitUserSelect = 'none';
  }

  if (s.disableImageDragging) {
    document.addEventListener('dragstart', (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault();
    });
  }
})();
