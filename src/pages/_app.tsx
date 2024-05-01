import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import React from "react";

import theme from "../theme/themeConfig";

// const App = ({ Component, pageProps }: AppProps) => (
//   <NextIntlClientProvider
//     locale={router.locale}
//     timeZone="Asia/Jakarta"
//     messages={pageProps.messages}
//   >

//     <ConfigProvider theme={theme}>
//       <Component {...pageProps} />
//     </ConfigProvider>
//   </NextIntlClientProvider>
// );

// export default App;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Asia/Jakarta"
      messages={pageProps.messages}
    >
      <ConfigProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ConfigProvider>
    </NextIntlClientProvider>
  );
}
