"use client";

import { useState, useEffect } from "react";
import { ResponsiveContainer, ResponsiveContainerProps } from "recharts";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

interface ResponsiveChartProps extends Omit<ResponsiveContainerProps, "children"> {
  children: ResponsiveContainerProps["children"];
  mobileHeight?: number;
  desktopHeight?: number;
}

export function ResponsiveChart({
  children,
  mobileHeight = 200,
  desktopHeight = 300,
  ...props
}: ResponsiveChartProps) {
  const isMobile = useIsMobile();
  const height = isMobile ? mobileHeight : desktopHeight;

  return (
    <ResponsiveContainer width="100%" height={height} {...props}>
      {children}
    </ResponsiveContainer>
  );
}

export function useChartConfig() {
  const isMobile = useIsMobile();

  return {
    isMobile,
    tickFontSize: isMobile ? 9 : 11,
    margin: isMobile
      ? { top: 10, right: 10, left: -10, bottom: 0 }
      : { top: 10, right: 20, left: 0, bottom: 0 },
    labelInterval: isMobile ? "preserveStartEnd" : undefined,
    legendLayout: isMobile ? "vertical" : "horizontal",
  };
}

export { useIsMobile };
