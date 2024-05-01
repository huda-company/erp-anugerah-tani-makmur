import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

const Home = () => {
  const router = useRouter();

  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

  return <>aaa</>;
};

export default Home;
