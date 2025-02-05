"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Custom styling for NProgress
const LoadingBar = () => {
    const pathname = usePathname();

    useEffect(() => {
        NProgress.start();
        NProgress.set(0.3); // Set initial progress

        const timeout = setTimeout(() => {
            NProgress.done(); // Complete after a short delay
        }, 500);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <style jsx global>{`
      #nprogress .bar {
        background: #ff0000; /* YouTube red */
        height: 3px;
      }
    `}</style>
    );
};

export default LoadingBar;
