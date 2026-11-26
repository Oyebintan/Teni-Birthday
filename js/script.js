
const pageOne = document.getElementById("pageOne");
const pageTwo = document.getElementById("pageTwo");
const pageThree = document.getElementById("pageThree");

const collectMail = document.getElementById("collectMail");
const openLetter = document.getElementById("openLetter");

const typingTitle = document.getElementById("typingTitle");

const celebration = document.getElementById("celebration");
const confettiContainer = document.getElementById("confetti");

const birthdayMusic = document.getElementById("birthdayMusic");
const musicToggle = document.getElementById("musicToggle");


// PAGE NAVIGATION

function showPage(page) {
    document.querySelectorAll(".page").forEach(section => {
        const isActive = section === page;
        section.classList.toggle("active", isActive);
        section.inert = !isActive;
    });
}


// PAGE ONE: LOOPING TYPING ANIMATION

const titleText = "mail";
let titleIndex = 0;
let deleting = false;

function typeTitle() {
    if (!typingTitle) return;

    if (!deleting) {
        typingTitle.textContent = titleText.slice(0, titleIndex + 1);
        titleIndex++;

        if (titleIndex === titleText.length) {
            deleting = true;
            setTimeout(typeTitle, 1300);
            return;
        }

        setTimeout(typeTitle, 180);

    } else {
        typingTitle.textContent = titleText.slice(0, titleIndex - 1);
        titleIndex--;

        if (titleIndex === 0) {
            deleting = false;
            setTimeout(typeTitle, 450);
            return;
        }

        setTimeout(typeTitle, 100);
    }
}

typeTitle();


// PAGE ONE -> PAGE TWO

collectMail.addEventListener("click", () => {
    showPage(pageTwo);
});


// CONFETTI

function createConfetti() {
    confettiContainer.innerHTML = "";

    const colours = [
        "#AB094B",
        "#E7A6C2",
        "#FFF9F5",
        "#D98BAE",
        "#6B1939"
    ];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement("span");

        piece.classList.add("confetti-piece");

        piece.style.left = Math.random() * 100 + "%";
        piece.style.background =
            colours[Math.floor(Math.random() * colours.length)];

        piece.style.animationDelay = Math.random() * 0.8 + "s";
        piece.style.animationDuration = 2.5 + Math.random() * 2 + "s";

        piece.style.width = 5 + Math.random() * 7 + "px";
        piece.style.height = 8 + Math.random() * 12 + "px";

        confettiContainer.appendChild(piece);
    }
}


// PAGE TWO -> CELEBRATION -> PAGE THREE

let celebrationStarted = false;

openLetter.addEventListener("click", async () => {

    if (celebrationStarted) return;

    celebrationStarted = true;

    // Start the music from this user interaction.
    birthdayMusic.volume = 0.65;

    birthdayMusic.play().then(() => {
        musicToggle.textContent = "♫ Music on";
    }).catch(error => {
        console.log("Music playback was blocked:", error);
        musicToggle.textContent = "♫ Play music";
    });

    // Show the celebration popup.
    celebration.classList.add("show");

    // Release the confetti!
    createConfetti();

    // Let the popup stay visible before revealing the birthday letter.
    setTimeout(() => {

        // Reveal the final page underneath the fading popup.
        showPage(pageThree);

        celebration.classList.remove("show");

        // Remove confetti elements after their animation.
        setTimeout(() => {
            confettiContainer.innerHTML = "";
        }, 1000);

    }, 3500);

});


// MUSIC BUTTON

musicToggle.addEventListener("click", () => {

    if (birthdayMusic.paused) {

        birthdayMusic.play().then(() => {
            musicToggle.textContent = "♫ Music on";
        }).catch(error => {
            console.log("Unable to play music:", error);
        });

    } else {

        birthdayMusic.pause();
        musicToggle.textContent = "♫ Music off";

    }

});
