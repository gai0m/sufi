// --- Get Elements ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
const square = document.getElementById('hacker-square');
const quoteTextElement = document.getElementById('quote-text');
// Removed popupSquare and popupCloseButton variables

// --- Matrix Rain Setup ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ';
const charsArray = matrixChars.split('');
const fontSize = 14;
const columns = Math.ceil(canvas.width / fontSize);
const drops = []; // y-coordinate for each column's drop

// Initialize drops at random heights for immediate full screen effect
for (let x = 0; x < columns; x++) {
    drops[x] = Math.floor(Math.random() * (canvas.height / fontSize));
}

// Matrix Rain Colors
const matrixGreen = '#0F0'; // Bright Green
const matrixRed = '#F00';   // Bright Red
const matrixHighlight = '#FFF'; // White/Light green highlight

let matrixInterval = null; // To store the interval ID

// --- Main Square Flashing Setup (Faster Cycle & New Colors) ---
const darkSquareColors = [
    '#101010', // Dark Gray
    '#051005', // Very Dark Green/Black
    '#001a00', // Dark Green
    '#181818', // Slightly Lighter Dark Gray
    '#002500', // Another Dark Green
    '#202020', // Standard Dark Gray
    '#151515', // Darker Gray
    '#3D0000', // Very Dark Red (rare accent)
    '#080808', // Near Black
    '#1e1e1e', // Another Dark Gray
    '#000d00', // Extremely Dark Green
    '#030303'  // Almost Black
];
const quoteTextColors = ['#E0E0E0', '#B0C4DE', '#98FB98', '#FFD700', '#AFEEEE', '#F5F5DC', '#CCCCCC', '#77AADD', '#AAAA77', '#DA70D6'];
const quotes = ["// System Locked", "decrypt(target.sys);", "Scanning network...", "Connection refused.", "user@localhost:~$", "< Reality is malleable >", "Encrypting...", "Ghost protocol active.", "Searching for vulnerability...", "Permission denied.", "Trace masked.", "Stealth mode engaged.", "Monitoring traffic...", "Compiling obfuscated code...", "for (;;) {}", "Error: Core Dumped", "VPN tunnel established.", "Security Alert!", "traceroute target.com", "Unloading driver...", "Authentication failed.", "0xCAFEBABE", "Intrusion detected.", "echo 'Owned' > /dev/null", "Injecting shellcode...", "Session expired.", "Persistence achieved."];

// --- SPEED ADJUSTMENTS FOR QUOTE SQUARE ---
const maxDelay = 350;    // Much faster "slowest" point
const minDelay = 40;     // Very fast "fastest" point
let currentBaseDelay = maxDelay; // Start at the new maxDelay
const speedChangeFactor = 0.96; // Speeds up/slows down reasonably fast
const randomVariance = 0.5;  // Increase randomness slightly
let direction = 'speeding_up'; // Initial direction: 'speeding_up' or 'slowing_down'
let flashingSquareTimeout = null; // To store the flashing square timeout ID
// --- End Speed Adjustments ---


// --- Functions ---

// Matrix Rain Drawing Function
function drawMatrix() {
    // Semi-transparent black fill for the fading trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    // Loop through drops
    for (let i = 0; i < drops.length; i++) {
        const text = charsArray[Math.floor(Math.random() * charsArray.length)];

        // Decide color: Mostly green, occasionally red, highlight leading char
        let charColor = matrixGreen;
        if (Math.random() < 0.005) { // Small chance for red
           charColor = matrixRed;
        }

        // Draw character
        ctx.fillStyle = charColor;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Draw highlighted character slightly above (simulate leading edge)
        // Make highlighting slightly less frequent to avoid too much white noise
        if (drops[i] * fontSize > fontSize * 2 && Math.random() > 0.1) {
             const prevText = charsArray[Math.floor(Math.random() * charsArray.length)];
             ctx.fillStyle = matrixHighlight; // Or light green '#9F9'
             ctx.fillText(prevText, i * fontSize, (drops[i] - 1) * fontSize);
        }

        // Reset drop to top if it goes off-screen (always reset for continuous rain)
        if (drops[i] * fontSize > canvas.height) {
            drops[i] = 0; // Reset to the top
        }

        // Increment y coordinate
        drops[i]++;
    }
}

// Main Square Flashing Function
function changeLook() {
    const newBgColor = darkSquareColors[Math.floor(Math.random() * darkSquareColors.length)];
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const newQuoteColor = quoteTextColors[Math.floor(Math.random() * quoteTextColors.length)];

    square.style.backgroundColor = newBgColor;
    quoteTextElement.textContent = newQuote;
    quoteTextElement.style.color = newQuoteColor;
}

// Main Square Speed Scheduling Function (Slow-Fast-Slow Cycle with new speed params)
function scheduleNextChange() {
    const delayVariance = currentBaseDelay * randomVariance * (Math.random() - 0.5) * 2;
    let actualDelay = currentBaseDelay + delayVariance;
    actualDelay = Math.max(minDelay * 0.8, actualDelay); // Allow variance slightly below min
    actualDelay = Math.min(maxDelay * 1.2, actualDelay); // Allow variance slightly above max

    // Clear previous timeout before setting a new one
    if (flashingSquareTimeout) clearTimeout(flashingSquareTimeout);

    flashingSquareTimeout = setTimeout(() => {
        changeLook();
        // Update base delay for the *next* iteration based on direction
        if (direction === 'speeding_up') {
            currentBaseDelay *= speedChangeFactor; // Decrease delay (speed up)
            if (currentBaseDelay <= minDelay) {
                currentBaseDelay = minDelay;      // Hit the minimum speed
                direction = 'slowing_down';     // Change direction
            }
        } else { // direction === 'slowing_down'
            currentBaseDelay /= speedChangeFactor; // Increase delay (slow down)
            if (currentBaseDelay >= maxDelay) {
                currentBaseDelay = maxDelay;      // Hit the maximum speed
                direction = 'speeding_up';        // Change direction
            }
        }
        scheduleNextChange(); // Schedule the next call
    }, actualDelay);
}

// Removed showPopup and hidePopup functions

// --- Event Listeners ---

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalculate columns and reset drops for better resize handling
    const newColumns = Math.ceil(canvas.width / fontSize);
    drops.length = 0; // Clear existing drops
    for (let x = 0; x < newColumns; x++) {
        drops[x] = Math.floor(Math.random() * (canvas.height / fontSize)); // Random start height
    }
});

// Removed popup close button listener

// --- Initialization ---

// Start Matrix Rain - runs indefinitely now
matrixInterval = setInterval(drawMatrix, 45); // Faster rain interval

// Start the main flashing square animation
changeLook(); // Initial look
scheduleNextChange();

// Removed the setTimeout that stopped the rain and showed the pop-up