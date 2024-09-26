// Set the interval to 20 minutes (20 * 60 seconds)
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("eyeBreak", { periodInMinutes: 20 });
});

// Listen for the alarm and show a notification
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "eyeBreak") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Eye Break Reminder",
      message: "Look away from your screen for 20 seconds!",
      silent: false,
    });
  }
});
