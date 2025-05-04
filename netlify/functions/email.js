import nodemailer from "nodemailer";

exports.handler = async (event) => {
  try {
    const { name, email, message } = JSON.parse(event.body);
    if (!name || !email || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: "All fields are required." }) };
    }

    // Configure SMTP Transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
      },
    });

    // Define email details
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "saiprakash.bollam17@gmail.com", 
      subject: `New Message Form Portfolio: from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return { statusCode: 200, body: JSON.stringify({ success: "Email sent successfully!" }) };

  } catch (error) {
    console.error("SMTP Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send email." }) };
  }
};
