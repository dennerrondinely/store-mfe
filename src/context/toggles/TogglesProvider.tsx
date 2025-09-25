import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useFirestoreCollection } from '../../api/hooks/useFirestoreCollection';

// @ts-ignore
import { useToggleStore } from 'Store/Store';

interface Toggle {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

type TogglesContextType = {
  toggles: Toggle[];
  loading: boolean;
};

const TogglesContext = createContext<TogglesContextType | undefined>(undefined);

const TogglesProvider = ({ children }: { children: ReactNode }) => {
  const { data: toggles, loading } = useFirestoreCollection<Toggle>('toggles');
  const { setToggles } = useToggleStore();

  useEffect(() => {
    if (toggles) {
      setToggles(toggles);
    }
  }, [setToggles, toggles]);
  return (
    <TogglesContext.Provider
      value={{
        toggles,
        loading,
      }}
    >
      {children}
    </TogglesContext.Provider>
  );
};

export const useToggles = () => {
  const context = useContext(TogglesContext);
  if (!context) {
    throw new Error('useToggles must be used within a TogglesProvider');
  }
  return context;
};

export default TogglesProvider;
