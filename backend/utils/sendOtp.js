import nodemailer from 'nodemailer';

// Initialize the transporter with your email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Using Gmail as the SMTP service
  auth: {
    user: process.env.EMAIL_USER,  // Your email address (e.g., 'your-email@gmail.com')
    pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
  },
});

// Function to generate a 6-digit OTP
export const generateOtp = () => {
  const otpLength = 6;
  let otp = '';
  
  // Generate a 6-digit OTP
  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10);  // Generate a random digit (0-9)
  }

  return otp;
};

// Function to send OTP via email
export const sendOtp = async (email) => {
  try {
    const otp = generateOtp();  // Generate the OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,  // Sender address (your email)
      to: email,  // Recipient address (user's email)
      subject: 'Your OTP for Registration',  // Email subject
      text: `Your OTP for registration is: ${otp}. It will expire in 10 minutes.`,  // Email body
    };

    // Send the email with OTP
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (err) {
    console.error('Error sending OTP:', err);
    throw new Error('Failed to send OTP');
  }
};
