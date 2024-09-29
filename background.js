let countdownTimer;
let timeLeft = 1200; // 20 minutes in seconds
let isActive = false;

// Set the interval to 20 minutes
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.alarms.create("eyeBreak", { periodInMinutes: 20 });
//   console.log("Alarm created: 20 minutes interval");
// });

// Listen for the alarm and show a notification
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "eyeBreak") {
    console.log("Alarm triggered: eyeBreak");
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Eye Break Reminder",
      message: "Look away from your screen for 20 seconds!",
      silent: false,
    });
  }
});

// Start the countdown timer
function startCountdown() {
  isActive = true;
  countdownTimer = setInterval(() => {
    if (timeLeft <= 0) {
      timeLeft = 1200; // Reset to 1200 seconds (20 minutes)
      chrome.alarms.create("eyeBreak", { periodInMinutes: 20 }); // Restart alarm for 20 minutes
      chrome.storage.local.set({ remainingTime: timeLeft }); // Update storage with reset time
    } else {
      timeLeft--;
      chrome.storage.local.set({ remainingTime: timeLeft });
    }
  }, 1000);
}

// Stop the countdown timer
function stopCountdown() {
  clearInterval(countdownTimer);
  isActive = false; // Mark as inactive
  timeLeft = 1200; // Reset to 1200 seconds (20 minutes)
  chrome.storage.local.remove("remainingTime");
}

// Message listener for starting/stopping the countdown
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "start") {
    if (!isActive) {
      startCountdown();
    }
  } else if (request.action === "stop") {
    stopCountdown();
  }
});

// Load remaining time from storage on startup
chrome.storage.local.get("remainingTime", (data) => {
  if (data.remainingTime) {
    timeLeft = data.remainingTime; // Restore remaining time if it exists
    if (isActive) {
      startCountdown(); // Restart if it's active
    }
  }
});
