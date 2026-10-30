const textarea = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

// Update character counts, word counts, and warning classes
function updateCounts() {
    const text = textarea.value;
    const length = text.length;
    
    // Calculate words (splitting by whitespace and filtering empty strings)
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    charCount.textContent = `${length} / 200 characters`;
    wordCount.textContent = `${words} words`;

    // Reset indicator classes
    charCount.classList.remove("warning", "over");

    // Apply conditional warning/over classes
    if (length > 200) {
        charCount.classList.add("over");
    } else if (length > 180) {
        charCount.classList.add("warning");
    }
}

// Restore saved draft and theme settings on load
function init() {
    const savedDraft = localStorage.getItem("noteDraft");
    if (savedDraft !== null) {
        textarea.value = savedDraft;
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }

    updateCounts();
}

// Event Listeners
textarea.addEventListener("input", () => {
    updateCounts();
    localStorage.setItem("noteDraft", textarea.value);
});

// Clear button functionality
clearBtn.addEventListener("click", () => {
    textarea.value = "";
    localStorage.removeItem("noteDraft");
    updateCounts();
});

// Escape key clears textarea
textarea.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        textarea.value = "";
        localStorage.removeItem("noteDraft");
        updateCounts();
    }
});

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    
    if (isDark) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "Light mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "Dark mode";
    }
});

// Run initialization on page load
init();
