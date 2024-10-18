import React from "react";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({
  children,
}) => {
  return (
    <main className="max-h-[100vh] p-4 lg:p-6 overflow-y-auto">{children}</main>
  );
};

export default MainContentWrapper;
