import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next/types";

import { SignupVerifEmailTemplate } from "@/templates/email/EmailVerification";

import { APP_NAME } from "^/config/env";
import { respBody } from "^/config/serverResponse";
import connectToDatabase from "^/mongodb/connDB";
import User from "^/mongodb/schemas/user";
import { sendEmail } from "^/utils/sendMail";

export const doSignup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, name, password, phone, birthDate, gender } = req.body;

  try {
    await connectToDatabase();

    const checkUser = await User.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (checkUser) {
      return res
        .status(400)
        .json(respBody.ERROR.EMAIL_OR_PHONE_ALREADY_REGISTERED);
    } else {
      //create new user on mongodb
      const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        plainPassword: password,
        phone: phone,
        birthDate: birthDate,
        gender: gender,
        roles: ["65747721e91490d7ca9f0b32"],
      });

      //create verifCode
      const encodeNewUser = await moment.now();

      await User.findByIdAndUpdate(
        newUser.id,
        { $set: { emailVerifCode: encodeNewUser } },
        { new: true }
      );

      //send verif email
      const htmlTemplate = await SignupVerifEmailTemplate({
        logo: "https://i.ibb.co/SvgJGcV/kosmobil-logo.png",
        headline: "Email Verification",
        verifCode: encodeNewUser,
        name: name,
        footer: "Everything about sports",
      });

      const emailParam = {
        to: email,
        subject: `${APP_NAME} Email Verification`,
        text: "This is a plain text email.",
        html: htmlTemplate,
      };

      sendEmail(emailParam);

      return res.status(200).json({
        ...respBody.SUCCESS.NEW_USER_CREATE,
        success: true,
        data: newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({ ...respBody.ERROR.UNEXPECTED_ERROR });
  }
};

export const doSignupVerification = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { type, email, code } = req.body;

  if (type == "phone")
    return res.status(400).json({ ...respBody.ERROR.FEATURE_IS_DISABLE });

  try {
    await connectToDatabase();

    const checkUser = await User.findOne({ email: email });

    if (
      typeof checkUser?.emailVerifAt !== "undefined" &&
      typeof checkUser?.emailVerifCode !== "undefined" &&
      checkUser?.emailVerifCode != null
    ) {
      return res.status(400).json({ ...respBody.ERROR.EMAIL_ALREADY_VERIFIED });
    }

    if (!checkUser?.emailVerifCode) {
      return res.status(400).json(respBody.ERROR.EMAIL_VERIF_CODE_EMPTY);
    }

    //if code !== code from DB
    if (String(code) !== String(checkUser.emailVerifCode)) {
      return res.status(400).json(respBody.ERROR.EMAIL_VERIF_CODE_MISMATCH);
    }

    await User.findByIdAndUpdate(
      checkUser.id,
      { $set: { emailVerifAt: moment.now() } }, // Update the 'age' field
      { new: true }
    );

    return res.status(200).json(respBody.SUCCESS.EMAIL_VERIF_SUCCESS);
  } catch (error) {
    return res.status(500).json({ ...respBody.ERROR.UNEXPECTED_ERROR });
  }
};
