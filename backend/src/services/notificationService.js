const admin = require("firebase-admin");
const logger = require("../utils/logger");

class NotificationService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }
    this.messaging = admin.messaging();
  }

  async sendNotification({ token, title, body, data = {} }) {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        data,
        token,
      };

      const response = await this.messaging.send(message);
      logger.info("Notification sent successfully", { response });
      return response;
    } catch (error) {
      logger.error("Error sending notification", { error });
      throw error;
    }
  }

  async sendBookingNotification(booking, userToken) {
    return this.sendNotification({
      token: userToken,
      title: "Booking Confirmed!",
      body: `Your booking ${booking.bookingNumber} has been confirmed.`,
      data: {
        bookingId: booking.id,
        type: "BOOKING_CONFIRMATION",
      },
    });
  }

  async sendTripUpdateNotification(trip, userTokens) {
    return this.sendNotification({
      token: userTokens,
      title: "Trip Update",
      body: `Your trip ${trip.id} has been updated.`,
      data: {
        tripId: trip.id,
        type: "TRIP_UPDATE",
      },
    });
  }
}

module.exports = new NotificationService();
