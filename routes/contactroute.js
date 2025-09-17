// routes/contact.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Contact = require("../models/contactsmodel"); // mongoose model

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // DB me save karo
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Email bhejne ka transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: email, // user ka email
      to: process.env.EMAIL_USER, // admin email
      subject: `New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

module.exports = router;
