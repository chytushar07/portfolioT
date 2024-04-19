// import { type NextRequest, NextResponse } from 'next/server';

// export async function POST(request: NextRequest) {
//   return NextResponse.json('Hello from API!');
// }

import { Coffee } from "lucide-react";
import { type NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const subjectOptions = {
  hire: "Hire",
  coffee: "have Coffie chat with",
  mentorship: "wants 1:1 Mentorship from you",
};

export async function POST(request: NextRequest) {
  const { email, name, message, type } = await request.json();

  const transport = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    // cc: email, (uncomment this line if you want to send a copy to the sender)
    subject: `${name} (${email}) wants to ${
      type === "hire"
        ? subjectOptions.hire
        : type === "coffee"
        ? subjectOptions.coffee
        : type === "mentorship"
        ? subjectOptions.mentorship
        : "Contact"
    } you`,
    text: message,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve("Email sent");
          console.log("sent");
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: "Email sent" });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
