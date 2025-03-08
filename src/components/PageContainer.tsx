import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  isHomePage?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, isHomePage = false }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${!isHomePage ? 'page-header-spacing' : ''}`}>
      {children}
    </div>
  );
};

export default PageContainer;