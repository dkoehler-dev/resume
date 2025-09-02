(function(){
	var STORAGE_KEY = 'theme-preference';
	var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

	function getStoredPreference() {
		try {
			var v = localStorage.getItem(STORAGE_KEY);
			return (v === 'light' || v === 'dark' || v === 'system') ? v : 'system';
		} catch (_) { return 'system'; }
	}

	function setStoredPreference(value) {
		try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
	}

	function getEffectiveMode(pref) {
		if (pref === 'light') return 'light';
		if (pref === 'dark') return 'dark';
		return (prefersDark && prefersDark.matches) ? 'dark' : 'light';
	}

	function applyTheme(pref) {
		var html = document.documentElement;
		var effective = getEffectiveMode(pref);
		if (pref === 'light') {
			html.setAttribute('data-theme', 'light');
		} else if (pref === 'dark') {
			html.setAttribute('data-theme', 'dark');
		} else {
			html.removeAttribute('data-theme');
		}
		var meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute('content', effective === 'dark' ? '#0d0d0d' : '#ffffff');
		}
	}

	function updateToggleUI(button, pref) {
		if (!button) return;
		var effective = getEffectiveMode(pref);
		button.classList.remove('fa-sun', 'fa-moon', 'fa-adjust');
		button.classList.add('icon', 'solid');
		if (pref === 'system') {
			button.classList.add('fa-adjust');
			button.title = 'Switch theme (Current: System)';
			button.setAttribute('aria-label', 'Switch theme (Current: System)');
			button.setAttribute('data-mode', 'system');
		} else if (effective === 'dark') {
			button.classList.add('fa-moon');
			button.title = 'Switch theme (Current: Dark)';
			button.setAttribute('aria-label', 'Switch theme (Current: Dark)');
			button.setAttribute('data-mode', 'dark');
		} else {
			button.classList.add('fa-sun');
			button.title = 'Switch theme (Current: Light)';
			button.setAttribute('aria-label', 'Switch theme (Current: Light)');
			button.setAttribute('data-mode', 'light');
		}
	}

	function cycle(pref) {
		if (pref === 'system') return 'dark';
		if (pref === 'dark') return 'light';
		return 'system';
	}

	document.addEventListener('DOMContentLoaded', function(){
		var pref = getStoredPreference();
		applyTheme(pref);
		var btn = document.getElementById('theme-toggle');
		updateToggleUI(btn, pref);
		if (btn) {
			btn.addEventListener('click', function(){
				pref = cycle(getStoredPreference());
				setStoredPreference(pref);
				applyTheme(pref);
				updateToggleUI(btn, pref);
			});
		}
	});

	if (prefersDark && prefersDark.addEventListener) {
		prefersDark.addEventListener('change', function(){
			var pref = getStoredPreference();
			if (pref === 'system') {
				applyTheme(pref);
				updateToggleUI(document.getElementById('theme-toggle'), pref);
			}
		});
	}
})();