import React from 'react';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className = '', children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={className} data-active-tab={activeTab}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            setActiveTab,
          });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return (
    <div className="flex space-x-1 border-b border-gray-200">
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
        activeTab === value
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  const { activeTab } = React.useContext(TabsContext);

  if (value !== activeTab) return null;

  return (
    <div className="py-4"> ```tsx
      {children}
    </div>
  );
};

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {},
});