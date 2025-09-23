import { useState } from "react";
import { doc, updateDoc, db } from "../firebase";

interface UseUpdateDocumentReturn<T> {
  updateDocument: (id: string, data: Partial<T>) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useUpdateDocument<T = unknown>(
  collectionName: string
): UseUpdateDocumentReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDocument = async (
    id: string,
    data: Partial<T>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      return true;
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateDocument, loading, error };
}
