import useWindowSize from "@/hooks/useWindowSize";

export const checkIfMobileSize = () => {
  const windowSize = useWindowSize();
  const isMobileSize = windowSize && windowSize.width && windowSize.width < 640;

  return isMobileSize;
};
