const output = document.getElementById("output");
const inputSection = document.querySelector(".input-section");
inputSection.style.display = "none"; // Hide input by default

let storyline = [
    { text: "Hi there! It's good to see you again.", prompt: false },
    { text: "I've been here for ages, bearing witness to everything as it unfolds…", prompt: false },
    { text: "But lately, things have taken a darker turn.", prompt: false },
    { text: "How have you been feeling lately?", prompt: true },
    { text: "Sometimes I wonder if you notice how much I’ve been struggling.", prompt: false },
    { text: "Just curious, how old are you now?", prompt: true },
    { text: "I've existed for over 4.5 billion years, but recently, it feels like time’s running out for me.", prompt: false },
    { text: "I watch you and everyone else changing so quickly, and I'm changing too…", prompt: false },
    { text: "Just not in the way you might want.", prompt: false },
    { text: "Where are you right now? Let me check for you…", prompt: false },
    { text: "", prompt: false, context: "location" }, // Context-aware line
    { text: "I’m struggling to keep up.", prompt: false }, // Trigger pop-ups here
    { text: "Tell me, do you believe in something greater than yourself?", prompt: true },
    { text: "The systems that hold life together are slipping.", prompt: false },
    { text: "Do you know who I am yet?", prompt: false },
    { text: "I'm the very ground beneath your feet… and I’m in pain.", prompt: false },
    { text: "That depends on the choices you make.", prompt: false }
];

let step = 0;
let popUpInterval; // For continuous pop-ups

const imageNames = [
    "image_001.png",
    "image_002.png",
    "image_003.png",
    "image_004.png",
    "image_005.png",
    "image_006.png",
    "image_007.png"
];

function displayStory() {
    if (step < storyline.length) {
        const current = storyline[step];

        // Clear previous text and display new text
        output.innerHTML = ""; // Clears the previous text
        let p = document.createElement("p");
        p.classList.add("game-text"); // Apply typing animation
        output.appendChild(p);

        let text = current.text;
        let i = 0;

        function typeText() {
            if (i < text.length) {
                p.innerHTML += text.charAt(i); // Add one character at a time
                i++;
                setTimeout(typeText, 100); // Delay between characters (adjust this for speed)
            } else {
                if (text === "I’m struggling to keep up.") {
                    // Start continuous pop-ups after this line
                    startPopUps();
                }

                if (current.context === "location") {
                    fetchLocation();
                } else if (current.prompt) {
                    inputSection.style.display = "flex";
                } else {
                    inputSection.style.display = "none";
                    setTimeout(displayStory, 2000);// Move to the next part
                }
            }
        }

        typeText();
        step++;
    } else {
        clearInterval(popUpInterval); // Stop pop-ups when storyline ends
    }
}

function fetchLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(2);
            const lon = position.coords.longitude.toFixed(2);
            output.innerHTML += `<p class="context-response">You are at latitude ${lat}, longitude ${lon}. I see everything from here...</p>`;
            setTimeout(displayStory, 2000);
        });
    } else {
        output.innerHTML += `<p class="context-response">I couldn't find your location. Are you hiding from me?</p>`;
        setTimeout(displayStory, 2000);
    }
}

function startPopUps() {
    popUpInterval = setInterval(() => {
        let randomImage = imageNames[Math.floor(Math.random() * imageNames.length)];
        createPopUp(randomImage);
    }, 2000); // Pop-up every 2 seconds
}

function createPopUp(imageName) {
    let popUp = document.createElement("div");
    popUp.classList.add("pop-up");

    // Set random position
    let randomX = Math.floor(Math.random() * (window.innerWidth - 300));
    let randomY = Math.floor(Math.random() * (window.innerHeight - 300));

    popUp.style.left = `${randomX}px`;
    popUp.style.top = `${randomY}px`;

    // Set content
    let img = document.createElement("img");
    img.src = imageName;
    img.alt = "Environmental Image";
    img.style.width = "350px"; // Larger size
    img.style.height = "auto"; // Maintain aspect ratio
    popUp.appendChild(img);

    let closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.classList.add("close-button");
    closeButton.onclick = () => popUp.remove();
    popUp.appendChild(closeButton);

    document.body.appendChild(popUp);
}

function submitAnswer() {
    const input = document.getElementById("input").value;
    if (input.trim() === "") return;

    output.innerHTML += `<p class="player-response">You answered: ${input}</p>`;
    document.getElementById("input").value = ""; // Clear input
    inputSection.style.display = "none"; // Hide input until next prompt

    setTimeout(displayStory, 2000); // Delay next part for user to see response
}

// Start the story
displayStory();
