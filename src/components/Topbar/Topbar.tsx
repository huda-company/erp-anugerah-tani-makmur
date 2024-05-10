/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import LocaleSwitcher from "../LocalSwitcher";

const Topbar = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Initial check on component mount
    handleResize();

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // The empty dependency array ensures that the effect runs only once on mount

  return (
    <>
      <div className="mt-[1rem] flex w-full items-center justify-between rounded-[1rem] bg-primary px-[0.9rem] py-1">
        <div className="flex h-8 w-1/4 items-center justify-start">
          <img src="/logo.png" width={50} height={50} alt="logo" />
        </div>
        <div className="flex h-8 w-1/2 items-center justify-center ">
          {/* <MultipleMenu /> */}
          Anugerah Tani Makmur
        </div>
        <div className="flex h-8 w-1/4 justify-end ">
          <LocaleSwitcher />
        </div>
      </div>
    </>
  );
};
export default Topbar;
