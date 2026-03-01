const nodeMailer = require("nodemailer");
const CustomErrorhandler = require("../error/custom-error.handler");

const sendMessage = async (name, code, email) => {

    try {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "ibratkamulov@gmail.com",
      pass: process.env.GOOGLE_PASS,
    }
  })


  await transporter.sendMail({
    subject: "Tasdiqlash kodi",
    from: "Ibrat Kamulov <ibratkamulov@gmail.com>",
    to: email,
   html: `
  <h2>Tasdiqlash kodi</h2>
  <p>Sizning tasdiqlash kodingiz:</p>
  <h1 style="letter-spacing:5px">${code}</h1>
  <p>Kod 2 daqiqa amal qiladi.</p>
`,
  });


}catch(error) {
    throw CustomErrorhandler.InternalServerError(error.message)
  }
}


module.exports = sendMessage
