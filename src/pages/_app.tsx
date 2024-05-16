import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";

import "@/styles/globals.css";

import { store } from "@/redux/store";
import TanstakProvider from "^/providers/TanstackProvider";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider
        locale={router.locale}
        timeZone="Asia/Jakarta"
        messages={pageProps.messages}
      >
        <TanstakProvider>
          <SessionProvider session={pageProps.session}>
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
          </SessionProvider>
        </TanstakProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
