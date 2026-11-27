(() => {
    "use strict";

    /* =========================================================
       ELEMENTS
       ========================================================= */

    const $ = (id) => document.getElementById(id);

    const pageOne = $("pageOne");
    const pageTwo = $("pageTwo");
    const pageThree = $("pageThree");
    const pages = [pageOne, pageTwo, pageThree];

    const collectMail = $("collectMail");
    const openLetter = $("openLetter");
    const envelopeArt = $("envelopeArt");

    const typingTitle = $("typingTitle");

    const celebration = $("celebration");
    const confettiContainer = $("confetti");
    const burstLayer = $("burstLayer");
    const floaties = $("floaties");

    const birthdayMusic = $("birthdayMusic");
    const musicToggle = $("musicToggle");
    const musicTip = $("musicTip");

    const letterBody = $("letterBody");
    const scrollHint = $("scrollHint");

    const floatingCake = $("floatingCake");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-heart"/></svg>';
    const rand = (min, max) => min + Math.random() * (max - min);


    /* =========================================================
       PAGE NAVIGATION
       ========================================================= */

    function showPage(page) {
        pages.forEach((section) => {
            const isActive = section === page;
            section.classList.toggle("active", isActive);
            section.inert = !isActive;
        });

        if (page === pageThree) {
            letterBody.scrollTop = 0;
            updateScrollHint();
            setTimeout(showMusicTip, 1800);
            setTimeout(() => {
                letterReadyToFinish = true;
                updateScrollHint();
            }, 4000);
        }
    }


    /* =========================================================
       BACKGROUND: SLOWLY RISING HEARTS + SPARKLES
       ========================================================= */

    function buildFloaties() {
        if (reducedMotion || !floaties) return;

        const count = window.innerWidth < 860 ? 12 : 20;

        for (let i = 0; i < count; i++) {
            const el = document.createElement("span");
            const isSparkle = i % 4 === 3;
            const size = rand(10, 26);

            el.className = "floaty";
            el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">` +
                `<use href="#${isSparkle ? "i-sparkle" : "i-heart"}"/></svg>`;

            el.style.left = rand(2, 96) + "%";
            el.style.animationDuration = rand(14, 26) + "s";
            el.style.animationDelay = "-" + rand(0, 26) + "s";
            el.style.setProperty("--sway", rand(-30, 30) + "px");
            el.style.setProperty("--o", rand(0.14, 0.3).toFixed(2));

            if (i % 3 === 0) el.style.color = "var(--hot)";
            if (i % 5 === 0) el.style.color = "var(--rose)";

            floaties.appendChild(el);
        }
    }


    /* =========================================================
       CLICK EFFECT: BURST OF HEARTS
       ========================================================= */

    function burstHearts(origin, count = 16) {
        if (reducedMotion || !burstLayer) return;

        const rect = origin.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        for (let i = 0; i < count; i++) {
            const el = document.createElement("span");
            const size = rand(10, 24);

            el.className = "burst-heart";
            el.innerHTML = HEART;
            el.style.cssText = `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
                `color:${["#F5116C", "#AB094B", "#E7A6C2", "#FF6FA8"][i % 4]}`;

            burstLayer.appendChild(el);

            const angle = -Math.PI / 2 + rand(-1, 1) * (Math.PI * 0.62);
            const dist = rand(70, 170);
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            const spin = rand(-40, 40);

            const animation = el.animate(
                [
                    { transform: "translate(-50%, -50%) scale(.2) rotate(0deg)", opacity: 0 },
                    { transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% + ${dy * 0.6}px)) scale(1) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.35 },
                    { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy - 30}px)) scale(.8) rotate(${spin}deg)`, opacity: 0 }
                ],
                { duration: rand(900, 1500), easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" }
            );

            animation.onfinish = () => el.remove();
        }
    }


    /* =========================================================
       PAGE ONE: LOOPING TYPING ANIMATION ("You've got a mail!")
       ========================================================= */

    const titleText = "a mail!";
    let titleIndex = 0;
    let deleting = false;
    let typingTimer = null;

    function typeTitle() {
        if (!typingTitle) return;

        if (!deleting) {
            typingTitle.textContent = titleText.slice(0, titleIndex + 1);
            titleIndex++;

            if (titleIndex === titleText.length) {
                deleting = true;
                typingTimer = setTimeout(typeTitle, 1300);
                return;
            }

            typingTimer = setTimeout(typeTitle, 180);

        } else {
            typingTitle.textContent = titleText.slice(0, titleIndex - 1);
            titleIndex--;

            if (titleIndex === 0) {
                deleting = false;
                typingTimer = setTimeout(typeTitle, 450);
                return;
            }

            typingTimer = setTimeout(typeTitle, 100);
        }
    }

    if (reducedMotion) {
        typingTitle.textContent = titleText;
    } else {
        typingTimer = setTimeout(typeTitle, 600);
    }


    /* =========================================================
       PAGE ONE -> PAGE TWO
       ========================================================= */

    collectMail.addEventListener("click", () => {
        burstHearts(collectMail, 12);
        showPage(pageTwo);
    });


    /* =========================================================
       CONFETTI
       ========================================================= */

    function createConfetti() {
        confettiContainer.innerHTML = "";

        const colours = ["#AB094B", "#E7A6C2", "#FFF9F5", "#D98BAE", "#F5116C", "#6B1939"];
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < 110; i++) {
            const piece = document.createElement("span");
            const colour = colours[Math.floor(Math.random() * colours.length)];
            const kind = i % 6;

            piece.className = "confetti-piece";

            if (kind === 0 || kind === 1) {
                const sizePx = rand(12, 22);
                piece.classList.add("heart");
                piece.innerHTML = HEART;
                piece.style.width = sizePx + "px";
                piece.style.height = sizePx + "px";
                piece.style.color = colour;
            } else if (kind === 2) {
                piece.classList.add("round");
                const sizePx = rand(6, 10);
                piece.style.width = sizePx + "px";
                piece.style.height = sizePx + "px";
                piece.style.background = colour;
            } else {
                piece.style.width = rand(5, 11) + "px";
                piece.style.height = rand(9, 19) + "px";
                piece.style.background = colour;
            }

            piece.style.left = rand(0, 100) + "%";
            piece.style.animationDelay = rand(0, 0.9) + "s";
            piece.style.animationDuration = rand(2.6, 4.6) + "s";
            piece.style.setProperty("--drift", rand(-80, 80) + "px");
            piece.style.setProperty("--spin", rand(360, 900) * (Math.random() < 0.5 ? -1 : 1) + "deg");

            fragment.appendChild(piece);
        }

        confettiContainer.appendChild(fragment);
    }


    /* =========================================================
       MUSIC
       - The birthday song only starts once the letter is opened,
         fading in low ("not loud").
       - The music button on page 3 controls the birthday song.
       ========================================================= */

    const MUSIC_VOLUME = 0.15;

    let musicOn = false;

    function fade(audio, target, ms, done) {
        cancelAnimationFrame(audio._fadeFrame);

        const from = audio.volume;
        const start = performance.now();

        function step(now) {
            const t = Math.min((now - start) / ms, 1);
            audio.volume = from + (target - from) * t;

            if (t < 1) {
                audio._fadeFrame = requestAnimationFrame(step);
            } else if (done) {
                done();
            }
        }

        audio._fadeFrame = requestAnimationFrame(step);
    }

    function tryPlay(audio, volume, fadeMs) {
        audio.volume = 0;
        audio.muted = false;

        return audio.play().then(() => {
            fade(audio, volume, fadeMs);
            return true;
        }).catch(() => false);
    }

    function renderMusicButton() {
        const label = musicOn ? "Mute music" : "Turn music on";

        musicToggle.classList.toggle("is-muted", !musicOn);
        musicToggle.setAttribute("aria-pressed", String(musicOn));
        musicToggle.setAttribute("aria-label", label);
        musicToggle.setAttribute("title", label);
    }

    async function setMusic(on) {
        musicOn = on;
        renderMusicButton();

        if (on) {
            const ok = await tryPlay(birthdayMusic, MUSIC_VOLUME, 900);

            if (!ok) {
                musicOn = false;
                renderMusicButton();
            }
        } else {
            fade(birthdayMusic, 0, 450, () => birthdayMusic.pause());
        }
    }

    musicToggle.addEventListener("click", () => {
        musicTip.classList.remove("show");
        setMusic(!musicOn);
    });

    renderMusicButton();

    let tipTimer = null;

    function showMusicTip() {
        if (!pageThree.classList.contains("active")) return;

        musicTip.textContent = musicOn ? "Tap to mute the music" : "Tap for music \u266B";
        musicTip.classList.add("show");

        clearTimeout(tipTimer);
        tipTimer = setTimeout(() => musicTip.classList.remove("show"), 4500);
    }


    /* =========================================================
       PAGE TWO -> CELEBRATION -> PAGE THREE
       (the button OR the envelope itself opens the letter;
        tapping the popup skips ahead once it has had a moment to land)
       ========================================================= */

    let celebrationStarted = false;
    let celebrationDone = false;
    let celebrationSkippable = false;
    const celebrationTimers = [];

    const later = (fn, ms) => celebrationTimers.push(setTimeout(fn, ms));

    function finishCelebration() {
        if (celebrationDone) return;
        celebrationDone = true;

        celebrationTimers.forEach(clearTimeout);

        showPage(pageThree);

        celebration.classList.remove("show");
        celebration.setAttribute("aria-hidden", "true");

        setTimeout(() => {
            confettiContainer.innerHTML = "";
        }, 1200);
    }

    function openTheLetter(origin) {
        if (celebrationStarted) return;
        celebrationStarted = true;

        setMusic(true);

        burstHearts(origin, 20);
        envelopeArt.classList.add("opening");
        envelopeArt.setAttribute("aria-disabled", "true");
        envelopeArt.removeAttribute("tabindex");

        later(() => {
            celebration.classList.add("show");
            celebration.setAttribute("aria-hidden", "false");
            createConfetti();
        }, 850);

        later(() => { celebrationSkippable = true; }, 850 + 700);
    }

    openLetter.addEventListener("click", () => openTheLetter(openLetter));
    envelopeArt.addEventListener("click", () => openTheLetter(envelopeArt));

    envelopeArt.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openTheLetter(envelopeArt);
        }
    });

    celebration.addEventListener("click", () => {
        if (celebrationSkippable) finishCelebration();
    });


    /* =========================================================
       PAGE THREE: only the letter scrolls, never the page.
       A soft fade + bouncing chevron show while there's more to
       read; reaching the sign-off glows the signature and sends
       up a few hearts.
       ========================================================= */

    const signature = letterBody.querySelector(".signature");
    let letterReadyToFinish = false;
    let letterFinished = false;

    function finishLetter() {
        if (letterFinished) return;
        letterFinished = true;

        signature.classList.add("finished");
        burstHearts(signature, 18);
    }

    function updateScrollHint() {
        const remaining = letterBody.scrollHeight - letterBody.clientHeight - letterBody.scrollTop;
        const more = remaining > 6;

        letterBody.classList.toggle("has-more", more);

        if (!more && letterReadyToFinish && pageThree.classList.contains("active")) {
            finishLetter();
        }
    }

    scrollHint.addEventListener("click", () => {
        letterBody.scrollBy({
            top: letterBody.clientHeight * 0.75,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    });

    letterBody.addEventListener("scroll", updateScrollHint, { passive: true });

    // stagger the letter paragraphs on first reveal
    letterBody.querySelectorAll("p").forEach((p, i) => p.style.setProperty("--i", i));

    window.addEventListener("resize", updateScrollHint);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateScrollHint);
    }

    updateScrollHint();


    /* =========================================================
       SUBTLE MOVEMENT ON THE ILLUSTRATIONS (pages 1 & 2)
       - desktop/mouse: follows the pointer
       - phones/tablets: follows the device tilt where available
       - always: a gentle idle sway runs on its own (see CSS),
         so there is movement even with no mouse or gyro
       ========================================================= */

    if (!reducedMotion) {
        const root = document.documentElement;
        let targetPX = 0;
        let targetPY = 0;
        let curPX = 0;
        let curPY = 0;

        function tiltTick() {
            curPX += (targetPX - curPX) * 0.08;
            curPY += (targetPY - curPY) * 0.08;
            root.style.setProperty("--px", curPX.toFixed(3));
            root.style.setProperty("--py", curPY.toFixed(3));
            requestAnimationFrame(tiltTick);
        }
        requestAnimationFrame(tiltTick);

        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            window.addEventListener("pointermove", (event) => {
                targetPX = (event.clientX / window.innerWidth - 0.5) * 2;
                targetPY = (event.clientY / window.innerHeight - 0.5) * 2;
            }, { passive: true });

        } else if (typeof DeviceOrientationEvent !== "undefined") {
            const startGyro = () => {
                window.addEventListener("deviceorientation", (event) => {
                    if (event.gamma == null || event.beta == null) return;
                    targetPX = Math.max(-1, Math.min(1, event.gamma / 24));
                    targetPY = Math.max(-1, Math.min(1, (event.beta - 35) / 24));
                });
            };

            if (typeof DeviceOrientationEvent.requestPermission === "function") {
                const unlock = () => {
                    DeviceOrientationEvent.requestPermission()
                        .then((state) => { if (state === "granted") startGyro(); })
                        .catch(() => {});

                    window.removeEventListener("touchend", unlock);
                    window.removeEventListener("click", unlock);
                };

                window.addEventListener("touchend", unlock, { once: true });
                window.addEventListener("click", unlock, { once: true });
            } else {
                startGyro();
            }
        }
    }


    /* =========================================================
       FLOATING CAKE (little surprise, tap for hearts)
       ========================================================= */

    if (floatingCake) {
        const popCake = () => burstHearts(floatingCake, 14);

        floatingCake.addEventListener("click", popCake);
        floatingCake.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                popCake();
            }
        });
    }

    buildFloaties();
})();