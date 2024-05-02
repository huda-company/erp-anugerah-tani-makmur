import { AUTH_PAGE_URL } from "@/constants/pageURL";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter()
  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    }
  });
  return (
    <>. . .</>
  );
}
