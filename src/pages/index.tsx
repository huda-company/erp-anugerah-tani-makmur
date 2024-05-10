import { AUTH_PAGE_URL } from "@/constants/pageURL";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

  if (session) router.push("/dashboard");

  return <>. . .</>;
}
