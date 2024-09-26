const toggleButton = document.getElementById("toggleButton");

// Check the current alarm state and update the button on popup open
chrome.alarms.get("eyeBreak", (alarm) => {
  if (alarm) {
    updateButton(true);
  } else {
    updateButton(false);
  }
});

// Add event listener to toggle the reminder
toggleButton.addEventListener("click", () => {
  chrome.alarms.get("eyeBreak", (alarm) => {
    if (alarm) {
      // If alarm exists, clear it
      chrome.alarms.clear("eyeBreak", () => {
        updateButton(false);
      });
    } else {
      // Otherwise, create a new alarm
      chrome.alarms.create("eyeBreak", { periodInMinutes: 20 });
      updateButton(true);
    }
  });
});

// Function to update the button state
function updateButton(isActive) {
  if (isActive) {
    toggleButton.textContent = "Stop Reminder";
    toggleButton.classList.remove("stopped");
    toggleButton.style.backgroundColor = "#dc3545"; // Red
  } else {
    toggleButton.textContent = "Start Reminder";
    toggleButton.classList.add("stopped");
    toggleButton.style.backgroundColor = "#28a745"; // Green
  }
}

// chrome.alarms.create("testAlarm", { delayInMinutes: 0.7 }); // Fires after 6 seconds

// chrome.alarms.onAlarm.addListener((alarm) => {
//   if (alarm.name === "testAlarm") {
//     console.log("Test alarm triggered");
//     chrome.notifications.create({
//       type: "basic",
//       iconUrl: "icon.png",
//       title: "Test Notification",
//       message: "This is a test notification.",
//       silent: false,
//     });
//   }
// });

// document.getElementById("toggleButton").addEventListener("click", () => {
//   chrome.alarms.create("eyeBreak", { periodInMinutes: 1 });
//   console.log("Manual start: Alarm set for 1 minute");
// });
