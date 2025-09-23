import React, { createContext, useEffect } from 'react';
import { useFirestoreCollection } from '../../api/hooks/useFirestoreCollection';
import { where } from '../../api/firebase';
import SplashScreen from '../../components/SplashScreen';
import { Federated, Script, ScriptManager } from '@callstack/repack/client';
import { Platform } from 'react-native';

type ModuleData = {
  id: string;
  name: string;
  scriptId: string;
  url: string;
  active: boolean;
  version: string;
};

interface ModulesContextValue {
  modules: ModuleData[];
  loading: boolean;
}

export const ModulesContext = createContext<ModulesContextValue>({
  modules: [],
  loading: true,
});

export const ModulesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: modules, loading } = useFirestoreCollection<ModuleData>(
    'module-version',
    [where('active', '==', true)],
  );

  useEffect(() => {
    if (modules && modules.length > 0) {
      const resolveURL = Federated.createURLResolver({
        containers: modules.reduce((acc, item) => {
          if (item.scriptId.includes('AddTransactions')) {
            return {
              ...acc,
              [item.scriptId]: 'http://localhost:9001/android/[name][ext]',
            };
          }
          return {
            ...acc,
            [item.scriptId]: `${item.url}/${item.scriptId}/${item.version}/outputs/${Platform.OS}/remotes/[name][ext]`,
          };
        }, {}),
      });

      ScriptManager.shared.addResolver(async (scriptId, caller) => {
        let url;
        console.log('Resolving', { scriptId, caller });
        if (caller === 'main') {
          url = Script.getDevServerURL(scriptId);
        } else {
          url = resolveURL(scriptId, caller);
        }

        if (!url) {
          return undefined;
        }

        return {
          url,
          cache: false,
          query: {
            platform: Platform.OS,
          },
        };
      });
    }
  }, [modules]);

  return (
    <ModulesContext.Provider value={{ modules, loading }}>
      {loading ? <SplashScreen name="poc" /> : children}
    </ModulesContext.Provider>
  );
};
