import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  isBillingOpen: boolean;
  setIsBillingOpen: (isOpen: boolean) => void;
  shouldOpenSettings: boolean;
  setShouldOpenSettings: (shouldOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [shouldOpenSettings, setShouldOpenSettings] = useState(false);

  return (
    <AppContext.Provider value={{ isBillingOpen, setIsBillingOpen, shouldOpenSettings, setShouldOpenSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};