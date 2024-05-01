import { APP_NAME } from "^/config/env";

export const SignupVerifEmailTemplate = (emailObject: any) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <link
      href="https://fonts.cdnfonts.com/s/14898/GothamBook.woff"
      rel="stylesheet"
    />
    <title>Email Verification</title>
    <style>
      body {
        font-family: "Gotham", sans-serif;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0;
        background-color: white;
        line-height: 150%;
      }
      .bodyEmail {
        background-color: #f8fafc;
        padding: 3rem 4.5rem 3rem 4.5rem;
      }
      .container {
        background-color: white;
        padding: 3.125rem;
      }
      .logoContainer {
        text-align: center;
        margin-bottom: 30px;
      }
      .bannerContainer {
        text-align: center;
        margin-bottom: 30px;
        border-radius: 16px;
      }
      .productListTitle {
        margin-top: 30px;
        font-weight: 700;
        margin-bottom: 30px;
        text-align: center;
      }
      .centered {
        text-align: center;
      }
      .semi-bold {
        font-weight: 700;
      }
      a {
        text-decoration: none;
        color: ${emailObject.textButtonColor};
      }
      p {
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: #242254;
      }
      footer {
        background-color: white;
        padding: 1.875rem 3.125rem 1.875rem 3.125rem;
      }
    </style>
  </head>
  <body>
    <div class="bodyEmail">
      <div class="container">
        <div class="logoContainer">
          <img
            height=100
            width=100
            src="${emailObject.logo}"
            alt="Logo Image"
          />
        </div>

        <h1 class="h3 mb-2" style="text-align: center">${emailObject.headline}</h1>
          <h5 class="text-teal-700" style="text-align: center"></h5>
          <hr>
          <div class="space-y-3">
            <p class="text-gray-700">Hello ${emailObject.name}, Welcome to kosmobil's family</p>
            <p class="text-gray-700"> This is your verification code :</p>
            <p class="text-gray-700" style="text-align:center; font-size: 80px;">${emailObject.verifCode}</p>
            <p class="text-gray-700" style="margin-top:20px">
              Please contact our customer support if you need some help. <a target="_blank" href="https://wa.me/6282280004281">Click this link</a>
            </p>
          </div>
          <hr>
      </div>
    </div>
    <footer>
        <h5 style="text-align: center">
            <a style="text-align: center" href="https://nunsolution.com/" target="_blank">-- ${APP_NAME} --</a>
        </h5>
        <p class="centered">
        ${emailObject.footer}
        </p>
    </footer>
  </body>
</html>
`;
