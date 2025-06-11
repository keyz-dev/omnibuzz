const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      const info = await this.transporter.sendMail({
        from: `"OmniBuzz" <${process.env.SMTP_FROM}>`,
        to,
        subject,
        text,
        html,
      });

      logger.info("Email sent successfully", { messageId: info.messageId });
      return info;
    } catch (error) {
      logger.error("Error sending email", { error });
      throw error;
    }
  }

  // Email templates
  async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: "Welcome to OmniBuzz!",
      html: `
        <h1>Welcome to OmniBuzz, ${user.firstName}!</h1>
        <p>Thank you for registering with us. We're excited to have you on board.</p>
      `,
    });
  }

  async sendBookingConfirmation(booking) {
    return this.sendEmail({
      to: booking.passengerDetails.email,
      subject: "Booking Confirmation - OmniBuzz",
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Your booking has been confirmed. Booking ID: ${booking.bookingNumber}</p>
        <p>Details:</p>
        <ul>
          <li>From: ${booking.trip.route.startStation.name}</li>
          <li>To: ${booking.trip.route.endStation.name}</li>
          <li>Date: ${new Date(booking.trip.departureDate).toLocaleDateString()}</li>
          <li>Seats: ${booking.seats.join(", ")}</li>
        </ul>
      `,
    });
  }
}

module.exports = new EmailService();
