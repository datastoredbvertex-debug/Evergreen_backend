const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { NotificationMessages, AdminNotificationMessages } = require("../Models/Notification.model");
const { Admin_Model } = require("../Models/Admin.model");
const UserModel = require("../Models/User.model");
const moment = require("moment-timezone");
const baseURL = process.env.BASE_URL;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendFCMNotificationfuntion = (registrationToken, title, body, imageUrl, url) => {
  const message = {
    notification: {
      title,
      body,
      image: imageUrl, // Add the image URL here
    },
    token: registrationToken,
  };

  return admin.messaging().send(message);
};

// this is for testing purpose Atest 18/04/2025

// const testSendNotification = async () => {
//   const testToken = "d5ur0tpiS9qN_V1IopdmER:APA91bHnW1-WvjP9WEwjQZho9zY9ihUtisdpdfwXaLNclF9EQbMYD95HawKonHB9Qo2Gd_tBJ6A_nJiZtG3GoZkGyrrDexBrs0jGIJbxJxy1KnGIv-MaBk4";
//   const title = "Test Notification";
//   const body = "This is a test message.";
//   const imageUrl = "https://example.com/sample-image.jpg";
//   const url = "https://app.evergreenion.com/";
//   const customData = {
//     sender_id: "1234567890",
//     full_name: "Test User",
//     role: "admin",
//     report_type: "daily",
//   };

//   try {
//     const response = await sendFCMNotificationfuntion(
//       testToken,
//       title,
//       body,
//       imageUrl,
//       url,
//       customData
//     );
//     console.log("Notification sent successfully:", response);
//   } catch (error) {
//     console.error("Failed to send test notification:", error);
//   }
// };

// testSendNotification();
// end 18/04/25

// exports.createNotification = async (sender_id, receiver_id, title, message, type, data = null) => {
//   console.log("sender_id", sender_id)
//   console.log("receiver_id", receiver_id)
//   console.log("title", title)
//   console.log("message", message)
//   try {
//     let senderUser;
//     let body;
//     if (type == "User_active_status") {
//       senderUser = await Admin_Model.findById(sender_id);
//       body = message;
//     } else {
//       senderUser = await UserModel.findById(sender_id);
//       body = senderUser + " " + message;
//     }
//     if (!senderUser) {
//       console.error("Sender not found in the user table");
//       return; // Exit if sender not found
//     }

//     const senderName = `${senderUser.full_name}`;

//     // Construct title, body, and imageUrl
//     const imageUrl = `${senderUser.pic}`;
//     const currentTime = moment().tz("Asia/Kolkata");
//     const datetime = currentTime.format("DD-MM-YYYY HH:mm:ss");
//     const url = "https://app.evergreenion.com/";

//     // Extract receiver IDs
//     if (type == "User_active_status") {
//       const users = await UserModel.findOne({ _id: receiver_id });
//       await sendFCMNotificationfuntion(users.firebase_token, title, body, imageUrl, url);
//       const newNotification = await NotificationMessages.create({
//         sender_id,
//         receiver_id: receiver_id, // Use extracted receiver IDs
//         message,
//         type,
//         datetime,
//         metadata: data,
//       });
//       await newNotification.save();

//     } else {
//       const receiverIds = receiver_id.map((user) => user._id);
//       const users = await UserModel.find({ _id: { $in: receiverIds } });
//       // Loop through each user and send notification if firebase_token is present
//       for (const user of users) {
//         if (user.firebase_token) {
//           await sendFCMNotificationfuntion(user.firebase_token, title, body, imageUrl, url);
//         }
//       }
//       const newNotification = await NotificationMessages.create({
//         sender_id,
//         receiver_id: receiverIds, // Use extracted receiver IDs
//         message,
//         type,
//         datetime,
//         metadata: data,
//       });
//       await newNotification.save();
//     }

//     // Optionally, save the notification to the database
//     // console.log("Notification sent and saved:", newNotification);
//   } catch (error) {
//     console.error("Error creating notification:", error);
//   }
// };

exports.createNotification = async (sender_id, receiver_ids, title, message, type, data = null) => {
  try {
    const senderUser = await UserModel.findById(sender_id) || await Admin_Model.findById(sender_id);
    if (!senderUser) {
      console.error("Sender not found");
      return;
    }

    const senderName = senderUser.full_name || "Unknown Sender";
    const body = `${senderName} ${message}`;
    const imageUrl = senderUser.pic || "";
    const currentTime = moment().tz("Asia/Kolkata");
    const datetime = currentTime.format("DD-MM-YYYY HH:mm:ss");
    const url = "https://app.evergreenion.com/";

    const receiverIds = Array.isArray(receiver_ids) ? receiver_ids : [receiver_ids];

    let users = [];
    try {
      users = await UserModel.find({ _id: { $in: receiverIds } });

      for (const user of users) {
        if (user.firebase_token) {
          try {
            await sendFCMNotificationfuntion(user.firebase_token, title, body, imageUrl, url);
          } catch (err) {
            console.warn(`Failed to send notification to user ${user._id}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch users or send notifications:", err.message);
      // Continue to saving
    }

    // ✅ Save the notification no matter what
    try {
      const newNotification = await NotificationMessages.create({
        sender_id,
        receiver_id: receiverIds,
        message,
        type,
        datetime,
        metadata: data,
      });
      console.log("Notification saved:", newNotification);
    } catch (err) {
      console.error("Failed to save notification:", err.message);
    }

  } catch (error) {
    console.error("Error in createNotification:", error.message);
  }
};



exports.AdmincreateNotification = async (sender_id, receiver_id, message, type, data = null) => {
  try {
    const senderUser = await UserModel.findById(sender_id);
    if (!senderUser) {
      console.error("Sender not found in the user table");
      return; // Exit if sender not found
    }

    const senderName = `${senderUser.full_name}`;

    // Construct title, body, and imageUrl
    const title = "Daily Report Update";
    const body = message;
    const imageUrl = `${senderUser.pic}`;
    const currentTime = moment().tz("Asia/Kolkata");
    const datetime = currentTime.format("DD-MM-YYYY HH:mm:ss");
    const url = "https://app.evergreenion.com/";

    // Extract receiver IDs
    const receiverIds = receiver_id.map((user) => user._id);

    // Send notifications
    for (const user of receiver_id) {
      if (user.firebase_token) {
        await sendFCMNotificationfuntion(user.firebase_token, title, body, imageUrl, url);
      }
    }

    // Optionally, save the notification to the database
    const newNotification = await AdminNotificationMessages.create({
      sender_id,
      receiver_id: receiverIds, // Use extracted receiver IDs
      message,
      type,
      datetime,
      metadata: data,
    });

    // console.log("Notification sent and saved:", newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
