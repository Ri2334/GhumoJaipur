import Booking from "../models/Booking.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import { createTransport } from "nodemailer";
import { createTransport as createMailerTransport } from "../utils/mailer.js";

export const sendBookingEmail = async (bookingId) => {
  const booking = await Booking.findById(bookingId).populate('driver user');
  if (!booking) throw new Error('Booking not found');

  const transport = createMailerTransport();
  if (!transport) return;

  const to = booking.user?.email || booking.user;
  const subject = `Ghumo Jaipur - Booking Confirmed (${booking._id})`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <h2>Booking Confirmed</h2>
      <p>Booking ID: <strong>${booking._id}</strong></p>
      <p>Pickup: ${booking.pickup}</p>
      <p>Destination: ${booking.destination}</p>
      <p>Fare: ₹${booking.fare}</p>
      <p>ETA: ${booking.etaMinutes} mins</p>
      ${booking.driver ? `<h3>Driver Details</h3><p>${booking.driver.name} · ${booking.driver.vehicle} · ${booking.driver.vehicleNumber} · Rating: ${booking.driver.rating}</p>` : ''}
    </div>
  `;

  await transport.sendMail({ from: process.env.MAIL_FROM, to, subject, html });
};
