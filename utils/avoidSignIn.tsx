import { getSession } from "next-auth/react";

export const avoidSignIn = async (context: any) => {
  const session = await getSession(context);
  console.log("avoidSignIn", context.locale);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard", // Redirect to the dashboard if authenticated
        permanent: false,
      },
    };
  }

  return {
    // Continue rendering the login page
    props: {
      messages: (await import(`^/dictionaries/${context.locale}.json`)).default,
    },
  };
};
