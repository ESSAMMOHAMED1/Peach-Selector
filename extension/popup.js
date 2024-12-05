const emojis = ["😁", "😊", "😐", "😕", "😡"]; 

// Generate emojis for rating
const emojiRatingDiv = document.getElementById("emojiRating");
let selectedRating = 0; // Default

// Create emoji buttons dynamically
emojis.forEach((emoji, index) => {
  const span = document.createElement("span");
  span.textContent = emoji;
  span.dataset.rating = index + 1; // Assign rating (1 to 5)
  span.classList.add("emoji");
  emojiRatingDiv.appendChild(span);

  // Handle click to select rating
  span.addEventListener("click", () => {
    selectedRating = index + 1;

    // Highlight selected emoji
    document
      .querySelectorAll(".emoji")
      .forEach((e) => e.classList.remove("selected"));
    span.classList.add("selected");
  });
});

// Handle apply button click
document.getElementById("apply").addEventListener("click", () => {
  if (selectedRating === 0) {
    alert("Please select a rating!");
    return;
  }

  // Send the selected rating to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: applyRatingToForm,
      args: [selectedRating],
    });
  });
});

// Function to be injected into the webpage
function applyRatingToForm(rating) {
  document.querySelectorAll("tr.element").forEach((row) => {
    const radios = row.querySelectorAll("input[type='radio']");
    if (radios[rating - 1]) {
      radios[rating - 1].disabled = false; // Enable the radio button
      radios[rating - 1].checked = true; // Select the radio button
    }
  });
}
