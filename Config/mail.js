const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// Replace with your actual Google Workspace credentials (obtain from Google Cloud Platform)
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;
const refreshToken = "1//0474bv2NLpcIlCgYIARAAGAQSNwF-L9IrdNWJ5hhb5Mie2w_uY079ry8Lv-wiv4m9JF_diM31HtL7Itqec5tUr0_MZs4R5p00eGQ"; // (Optional)


async function sendReportMail(data) {
  // Step 1: Destructure data object
  const { recipientEmail, subject, html } = data;

  // Step 2: Create an OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");

  // Step 3: Set the refresh token (optional, for long-term access)
  if (refreshToken) {
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
  }

  try {
    // Step 4: Obtain an access token
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token; // Get the token value from the response

    if (!accessToken) {
      throw new Error("Failed to obtain access token");
    }

    // Step 5: Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "admin@evergreenion.com", // Your Google Workspace email address
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    // Step 6: Define the email options
    const mailOptions = {
      from: "admin@evergreenion.com", // Your Google Workspace email address
      to: recipientEmail,
      subject: subject || "Ever Green Water",
      html: html || "<h1>Email Notification</h1>",
      priority: "high",
    };

    // Step 7: Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", recipientEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendReportMail;
