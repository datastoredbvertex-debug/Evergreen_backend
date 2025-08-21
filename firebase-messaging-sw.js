importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBlWD0kMT4chyns6JcHCFvxRXfTPyhTjgg",
  authDomain: "evergreenwater-4f65e.firebaseapp.com",
  projectId: "evergreenwater-4f65e",
  storageBucket: "evergreenwater-4f65e.appspot.com",
  messagingSenderId: "1004069241810",
  appId: "1:1004069241810:web:beb3a5f0fe50ae6efdfe0b",
  measurementId: "G-1157KM52P4",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
const channel = new BroadcastChannel("notificationChannel");

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  channel.postMessage({ type: "notificationReceived", payload: payload });
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    image: payload.data.image, // Add image if available
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click event
self.addEventListener("notificationclick", function (event) {
  const notification = event.notification;
  const url = notification.data.url; // Extract dynamic URL from notification data payload

  // Redirect to the specified URL
  event.waitUntil(clients.openWindow(url));
});
