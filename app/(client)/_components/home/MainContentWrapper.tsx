import React from "react";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

const MainContentWrapper: React.FC<MainContentWrapperProps> = ({
  children,
}) => {
  return (
    <main className="max-h-[100vh] py-4 overflow-y-auto container">
      {children}
    </main>
  );
};

export default MainContentWrapper;
