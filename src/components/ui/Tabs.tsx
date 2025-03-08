import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className = '', children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
  return (
    <div className={`flex space-x-1 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  disabled = false,
  className = '',
  children
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      disabled={disabled}
      className={`
        relative px-4 py-2 text-sm font-medium transition-colors
        ${isActive 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={() => setActiveTab(value)}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className = '',
  children
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { activeTab } = context;
  const isActive = activeTab === value;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isActive}
      className={className}
    >
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};