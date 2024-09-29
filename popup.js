const toggleButton = document.getElementById("toggleButton");
const timerDisplay = document.getElementById("timer");
let updateInterval; // To store the timer update interval

// Function to update the timer display
function updateTimerDisplay(timeLeft) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `Time until next break: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

// Function to retrieve remaining time and update the display
function loadRemainingTime() {
  chrome.storage.local.get("remainingTime", (data) => {
    const timeLeft = data.remainingTime || 1200; // Default to 1200 seconds if no stored time
    updateTimerDisplay(timeLeft);
  });
}

// Start periodically updating the timer display every second
function startUpdatingTimer() {
  if (updateInterval) {
    clearInterval(updateInterval); // Clear any previous intervals
  }

  updateInterval = setInterval(() => {
    chrome.storage.local.get("remainingTime", (data) => {
      const timeLeft = data.remainingTime || 1200;
      updateTimerDisplay(timeLeft); // Keep updating the display
    });
  }, 1000); // Update every second
}

// Check the current alarm state and update the button and timer on popup open
chrome.alarms.get("eyeBreak", (alarm) => {
  if (alarm) {
    toggleButton.textContent = "Stop Reminder";
    toggleButton.classList.add("stopped"); // Ensure the button is red
    loadRemainingTime(); // Load and display the remaining time immediately
    startUpdatingTimer(); // Start the UI updating process
  } else {
    toggleButton.textContent = "Start Reminder";
    toggleButton.classList.remove("stopped"); // Ensure class is removed
    updateTimerDisplay(1200); // Show initial time
  }
});

// Add event listener to toggle the reminder
toggleButton.addEventListener("click", () => {
  chrome.alarms.get("eyeBreak", (alarm) => {
    if (alarm) {
      // If alarm exists, clear it
      chrome.alarms.clear("eyeBreak", () => {
        toggleButton.textContent = "Start Reminder";
        toggleButton.classList.remove("stopped"); // Change color back to green
        chrome.runtime.sendMessage({ action: "stop" });
        updateTimerDisplay(1200); // Reset display
        chrome.storage.local.remove("remainingTime"); // Clear storage
        clearInterval(updateInterval); // Stop updating the timer UI
      });
    } else {
      // Otherwise, create a new alarm
      chrome.alarms.create("eyeBreak", { periodInMinutes: 20 });
      toggleButton.textContent = "Stop Reminder";
      toggleButton.classList.add("stopped"); // Change color to red
      chrome.runtime.sendMessage({ action: "start" });

      // Immediately start updating the timer display
      loadRemainingTime();
      startUpdatingTimer(); // Ensure the timer display is continuously updated
    }
  });
});

// Ensure to update the timer immediately when the popup is opened
loadRemainingTime(); // Call this to show initial time immediately
