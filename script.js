/* =========================
   ELEMENTS
========================= */

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

const celebrateButton =
    document.getElementById("celebrateButton");

const messageButton =
    document.getElementById("messageButton");

const popupCelebrate =
    document.getElementById("popupCelebrate");

const messagePopup =
    document.getElementById("messagePopup");

const closePopup =
    document.getElementById("closePopup");

const musicButton =
    document.getElementById("musicButton");

const birthdayMusic =
    document.getElementById("birthdayMusic");

const sparklesContainer =
    document.getElementById("sparkles");


/* =========================
   PERFORMANCE SETTINGS
========================= */

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const isMobile = window.matchMedia(
    "(max-width: 600px)"
).matches;

const MAX_CONFETTI = isMobile ? 80 : 130;

const FRAME_INTERVAL = 1000 / 30;

const colors = [
    "#ff4fa3",
    "#8b5cf6",
    "#38bdf8",
    "#ffd166",
    "#ffffff",
    "#34d399"
];


/* =========================
   CANVAS SETUP
========================= */

let width = window.innerWidth;
let height = window.innerHeight;

let confetti = [];

let animationFrame = null;
let lastFrameTime = 0;

function resizeCanvas() {

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5
    );

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =========================
   CREATE CONFETTI
========================= */

function createConfetti(
    amount = 50,
    originX = width / 2,
    originY = height * 0.4
) {

    if (reduceMotion) {
        return;
    }

    const available = MAX_CONFETTI - confetti.length;

    amount = Math.min(amount, available);

    if (amount <= 0) {
        return;
    }

    for (let i = 0; i < amount; i++) {

        const angle = Math.random() * Math.PI * 2;

        const speed = 2 + Math.random() * 5;

        confetti.push({

            x: originX,
            y: originY,

            vx: Math.cos(angle) * speed,

            vy: Math.sin(angle) * speed - 2,

            gravity: 0.06 + Math.random() * 0.06,

            size: 3 + Math.random() * 5,

            rotation: Math.random() * 360,

            rotationSpeed: (Math.random() - 0.5) * 8,

            color: colors[
                Math.floor(Math.random() * colors.length)
            ],

            life: 100 + Math.random() * 40

        });

    }

    if (animationFrame === null) {

        animationFrame = requestAnimationFrame(
            animateConfetti
        );

    }

}


/* =========================
   CONFETTI ANIMATION
========================= */

function animateConfetti(timestamp) {

    if (timestamp - lastFrameTime < FRAME_INTERVAL) {

        animationFrame = requestAnimationFrame(
            animateConfetti
        );

        return;
    }

    lastFrameTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    for (let i = confetti.length - 1; i >= 0; i--) {

        const p = confetti[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vy += p.gravity;

        p.rotation += p.rotationSpeed;

        p.life--;

        ctx.save();

        ctx.translate(p.x, p.y);

        ctx.rotate(p.rotation * Math.PI / 180);

        ctx.fillStyle = p.color;

        ctx.globalAlpha = Math.min(
            1,
            p.life / 20
        );

        ctx.fillRect(
            -p.size / 2,
            -p.size / 2,
            p.size,
            p.size * 0.7
        );

        ctx.restore();

        if (
            p.life <= 0 ||
            p.y > height + 20 ||
            p.x < -30 ||
            p.x > width + 30
        ) {

            confetti.splice(i, 1);

        }

    }

    if (confetti.length > 0) {

        animationFrame = requestAnimationFrame(
            animateConfetti
        );

    } else {

        animationFrame = null;

        ctx.clearRect(0, 0, width, height);

    }

}


/* =========================
   CELEBRATION EFFECT
========================= */

let celebrationCooldown = false;
let celebrationTimers = [];

function celebrate() {

    if (reduceMotion || celebrationCooldown) {
        return;
    }

    celebrationCooldown = true;

    createConfetti(
        50,
        width / 2,
        height * 0.4
    );

    celebrationTimers.push(

        setTimeout(() => {

            createConfetti(
                25,
                width * 0.2,
                height * 0.3
            );

        }, 350)

    );

    celebrationTimers.push(

        setTimeout(() => {

            celebrationCooldown = false;

            celebrationTimers = [];

        }, 1200)

    );

}


/* =========================
   CELEBRATE BUTTON
========================= */

celebrateButton.addEventListener("click", () => {

    celebrate();

    celebrateButton.textContent =
        "🎉 Happy Birthday!";

    setTimeout(() => {

        celebrateButton.textContent =
            "🎉 Celebrate!";

    }, 1800);

});


/* =========================
   MESSAGE POPUP
========================= */

messageButton.addEventListener("click", () => {

    messagePopup.classList.add("show");

    celebrate();

});

closePopup.addEventListener("click", () => {

    messagePopup.classList.remove("show");

});

messagePopup.addEventListener("click", (event) => {

    if (event.target === messagePopup) {

        messagePopup.classList.remove("show");

    }

});

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        messagePopup.classList.remove("show");

    }

});


/* =========================
   POPUP CELEBRATION
========================= */

popupCelebrate.addEventListener("click", () => {

    messagePopup.classList.remove("show");

    celebrate();

});


/* =========================
   MUSIC CONTROLS
========================= */

let musicPlaying = false;

musicButton.addEventListener("click", async () => {

    if (!musicPlaying) {

        try {

            await birthdayMusic.play();

            musicPlaying = true;

            musicButton.textContent =
                "⏸ Pause Music";

        } catch (error) {

            musicButton.textContent =
                "🎵 Music unavailable";

        }

    } else {

        birthdayMusic.pause();

        musicPlaying = false;

        musicButton.textContent =
            "🎵 Play Music";

    }

});

birthdayMusic.addEventListener("ended", () => {

    musicPlaying = false;

    musicButton.textContent =
        "🎵 Play Music";

});


/* =========================
   SPARKLE EFFECTS
========================= */

let sparkleCount = 0;

const MAX_SPARKLES = 8;

function createSparkle() {

    if (reduceMotion) {
        return;
    }

    if (document.hidden) {
        return;
    }

    if (sparkleCount >= MAX_SPARKLES) {
        return;
    }

    const sparkle = document.createElement("span");

    sparkle.className = "sparkle";

    const symbols = ["✦", "✧", "⋆"];

    sparkle.textContent =
        symbols[
            Math.floor(Math.random() * symbols.length)
        ];

    sparkle.style.left =
        Math.random() * 100 + "vw";

    sparkle.style.top =
        Math.random() * 100 + "vh";

    sparkle.style.fontSize =
        (10 + Math.random() * 10) + "px";

    sparklesContainer.appendChild(sparkle);

    sparkleCount++;

    setTimeout(() => {

        sparkle.remove();

        sparkleCount--;

    }, 2100);

}


/* =========================
   SPARKLE TIMER
========================= */

if (!reduceMotion) {

    setInterval(createSparkle, 1200);

}


/* =========================
   OPENING CELEBRATION
========================= */

window.addEventListener("load", () => {

    if (reduceMotion) {
        return;
    }

    setTimeout(() => {

        createConfetti(
            35,
            width / 2,
            height * 0.3
        );

    }, 500);

});


/* =========================
   PAUSE EFFECTS WHEN HIDDEN
========================= */

document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

        if (animationFrame !== null) {

            cancelAnimationFrame(animationFrame);

            animationFrame = null;

        }

        ctx.clearRect(0, 0, width, height);

    } else if (confetti.length > 0 && animationFrame === null) {

        lastFrameTime = 0;

        animationFrame = requestAnimationFrame(
            animateConfetti
        );

    }

});
