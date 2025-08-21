const { TestingUser, TestingTeacher_Notifications, TestingUser_meeting } = require('./Models/TestingUser.model');
const moment = require('moment-timezone');
require('dotenv').config();
const { sendFCMNotificationTeacher } = require('./Controllers/TestingUser.controller');

setInterval(() => {
      NotificationMeetingTeacher();
}, 60000); // 1 minute = 5000 milliseconds

const NotificationMeetingTeacher = async (req, res) => {
      // Get current local time
      const currentTime = moment().tz('Asia/Kolkata');

      const meetings = await TestingUser_meeting.find({});

      for (const meeting of meetings) {
            const meetingTimeParts = meeting.time.split(' '); // Splitting time into parts (e.g., ["11:50", "AM"])
            const meetingHourMinute = meetingTimeParts[0].split(':'); // Splitting hour and minute (e.g., ["11", "50"])
            let hour = parseInt(meetingHourMinute[0]);
            const minute = parseInt(meetingHourMinute[1]);
            const ampm = meetingTimeParts[1];

            // Convert to 24-hour format if PM
            if (ampm === 'PM' && hour < 12) {
                  hour += 12;
            }

            const meetingTime = moment(meeting.date).tz('Asia/Kolkata');
            meetingTime.hours(hour);
            meetingTime.minutes(minute);

            const formattedMeetingTime = meetingTime.toISOString();
            const formattedCurrentTime = currentTime.toISOString();

            const timeDifference = Math.abs(currentTime.diff(meetingTime, 'minutes')); // Difference in minutes

            if (timeDifference < 10 && !meeting.notificationCalled) {
                  console.log("sent", timeDifference);
                  console.log(formattedCurrentTime);
                  console.log(formattedMeetingTime);
                  const result = await TestingUser_meeting.updateOne(
                        { _id: meeting._id },
                        { $set: { notificationCalled: true } }
                  );
                  NotificationDataTeacher(meeting.date, meeting.time);
            } else {
                  // console.log("Already sent", timeDifference);
            }
      }
};

const NotificationDataTeacher = async (date, time) => {
      const userid = 12250423;
      try {
            try {
                  // Find the user by ID
                  const user = await TestingUser.findOne({ ConnectyCube_id: userid });

                  if (!user) {
                        console.log(`User with ID ${userid} not found`);
                        return null; // or handle error
                  }

                  // Extract the Firebase token from the user object
                  const { fairbase_token } = user;

                  // Call the sendFCMNotification function with the Firebase toke
                  const message = `You have a meeting at ${time}`;
                  await sendFCMNotificationTeacher(fairbase_token, 'Meeting Reminder', message);

                  // Create a new notification entry in the database
                  const newNotification = await TestingTeacher_Notifications.create({
                        user_id: userid,
                        message: message,
                        date: date,
                        time: time
                  });

                  if (newNotification) {
                        console.log(`Notification saved for user with ID ${userid}`);
                  }
            } catch (error) {
                  console.error(`Error sending notification for user with ID ${userid}:`, error);
            }

      } catch (error) {
            console.error('Error:', error);

      }
};

exports.MeetinggetDataTeacher = async (req, res) => {
      const user_id = 12250423;
      try {
            // Fetch meetings based on user_id
            const meetings = await TestingTeacher_Notifications.find({ user_id: user_id });
            const users = await TestingUser.find({ ConnectyCube_id: { $in: user_id } });

            res.status(200).json({ meetings: meetings, users: users, message: 'Meeting get successfully' });
      } catch (error) {
            console.error('Error fetching meetings:', error);
            throw error;
      }

};






