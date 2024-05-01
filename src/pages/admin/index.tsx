import { Button } from "antd";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { AUTH_PAGE_URL } from "@/constants/pageURL";

const Admin = () => {
  const router = useRouter();

  useSession({
    required: true,
    onUnauthenticated() {
      router.push(AUTH_PAGE_URL.SIGNIN);
    },
  });

  return (
    <Button onClick={() => signOut()} type="primary">
      logout
    </Button>
  );
};

export default Admin;
