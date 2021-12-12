const nodemailer = require("nodemailer");

require("dotenv").config();

const sendEmail = async (email, CustomerID) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASS_EMAIL,
      },
    });

    await transporter.sendMail({
      from: "ShopPet",
      to: email,
      subject: "Verify Email",
      text: "Bạn cần xác nhận email để đăng nhập tài khoản",
      html:
        "<h1>Vui lòng click vào link để xác nhận email</h1>" +
        "<a href='https://blooming-mountain-13837.herokuapp.com/api/auth/verifyEmail/" +
        CustomerID +
        "'>" +
        "Link xác nhận email</a>",
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
