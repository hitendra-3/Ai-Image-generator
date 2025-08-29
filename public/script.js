// script.js

const promptInput = document.getElementById("promptInput");
const charCount = document.getElementById("charCount");
const generateBtn = document.getElementById("generateBtn");
const loadingState = document.getElementById("loadingState");
const resultContainer = document.getElementById("resultContainer");
const generatedImage = document.getElementById("generatedImage");
const usedPrompt = document.getElementById("usedPrompt");
const imageError = document.getElementById("imageError");

// Character counter
promptInput.addEventListener("input", () => {
  charCount.textContent = promptInput.value.length;
});

// Use example prompt
function useExample(button) {
  promptInput.value = button.textContent.replace(/\"/g, "");
  charCount.textContent = promptInput.value.length;
}

// Handle image error
function handleImageError() {
  generatedImage.classList.add("hidden");
  imageError.classList.remove("hidden");
}

// Regenerate image
function regenerateImage() {
  generateImage(promptInput.value);
}

// Generate image function
async function generateImage(prompt) {
  if (!prompt) return alert("Please enter a prompt.");

  loadingState.classList.remove("hidden");
  resultContainer.classList.add("hidden");
  imageError.classList.add("hidden");

  try {
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error);

    // Stability returns Base64 -> directly usable
    generatedImage.src = data.imageUrl;
    generatedImage.classList.remove("hidden");
    usedPrompt.textContent = prompt;
    resultContainer.classList.remove("hidden");
  } catch (err) {
    console.error("❌ Error:", err);
    alert(`Failed to generate image: ${err.message}`);
  } finally {
    loadingState.classList.add("hidden");
  }
}

// Event Listener
generateBtn.addEventListener("click", () => {
  const prompt = promptInput.value.trim();
  generateImage(prompt);
});
