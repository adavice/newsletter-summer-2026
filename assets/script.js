document.documentElement.classList.add('js');

function fitScreens() {
    document.querySelectorAll('.screen').forEach(function (sc) {
        var w = parseFloat(sc.dataset.w), h = parseFloat(sc.dataset.h);
        var avail = document.documentElement.clientWidth;
        var scale = Math.min(avail, w) / w;
        sc.style.transform = 'scale(' + scale + ')';
        sc.parentElement.style.height = (h * scale) + 'px';
        sc.parentElement.style.width = Math.min(avail, w * scale) + 'px';
    });
}
window.addEventListener('resize', fitScreens);
window.addEventListener('load', fitScreens);
fitScreens();

// ---- Audio widget, wired to a real audio file ----
(function () {
    var widget = document.getElementById('audioWidget');
    var btn = document.getElementById('awPlayBtn');
    var timeEl = document.getElementById('awTime');
    var audio = document.getElementById('bgAudio');
    if (!widget || !btn || !audio) return;
    var iconPlay = btn.querySelector('.awIconPlay');
    var iconPause = btn.querySelector('.awIconPause');

    function formatTime(sec) {
        if (!isFinite(sec) || sec < 0) sec = 0;
        var m = Math.floor(sec / 60);
        var s2 = Math.floor(sec % 60);
        return m + ':' + (s2 < 10 ? '0' : '') + s2;
    }

    audio.addEventListener('timeupdate', function () {
        if (timeEl) timeEl.textContent = formatTime(audio.currentTime);
    });
    audio.addEventListener('play', function () {
        iconPlay.style.display = 'none';
        iconPause.style.display = '';
        widget.classList.add('playing');
        btn.setAttribute('aria-label', 'Pause Jumanji theme');
    });
    audio.addEventListener('pause', function () {
        iconPlay.style.display = '';
        iconPause.style.display = 'none';
        widget.classList.remove('playing');
        btn.setAttribute('aria-label', 'Play Jumanji theme');
    });
    audio.addEventListener('ended', function () {
        if (timeEl) timeEl.textContent = '0:00';
    });

    btn.addEventListener('click', function () {
        if (audio.paused) {
            audio.play().catch(function () { /* file not yet added, or blocked until user gesture */ });
        } else {
            audio.pause();
        }
    });
})();

// ---- Scroll-triggered text reveal (same fadeUpIn pattern as .route8/.rstop) ----
(function () {
    var selectors = [
        'h1',
        'h5',
        '.title-welcome',
        '.title-tothe',
        '.title-adventure',
        '.sign-script',
        '.sign-team',
        '.await',
        '.sub',
        '.intro',
        '.title',
        '#s1 .toc .item',
        '#s2 .letter-body > *',
        '#s3 .loc',
        '#s3 .know .k',
        '#s4 .sched .it',
        '#s4 .chk7 li',
        '#s4 .tips .it',
        '#s5 .rstop',
        '#s6 .ann9 .arow',
        '#s6 .bd .mrow',
        '#s6 .bd .wish',
        '#s6 .hol .hrow',
        '#s7 .lines'
    ];
    var els = document.querySelectorAll(selectors.join(','));
    if (!els.length) return;

    // only hide-then-reveal if this script actually runs; if it fails to load
    // (network error, blocked, etc.) content stays visible by default
    document.documentElement.classList.add('reveal-ready');

    if (!('IntersectionObserver' in window)) {
        els.forEach(function (el) { el.classList.add('in-view'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    els.forEach(function (el) { io.observe(el); });
})();