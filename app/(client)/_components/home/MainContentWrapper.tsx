import React from "react";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({
  children,
}) => {
  return <main className="max-h-[100vh] p-4">{children}</main>;
};

export default MainContentWrapper;
