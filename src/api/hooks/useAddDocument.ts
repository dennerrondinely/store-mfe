import { useState } from "react";
import { addDoc, collection, db, type WithFieldValue } from "../firebase";

interface UseAddDocumentReturn<T> {
  addDocument: (data: T) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

export function useAddDocument<T = unknown>(collectionName: string): UseAddDocumentReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDocument = async (data: Partial<T>): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, collectionName), data as WithFieldValue<unknown> );
      return docRef.id;
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addDocument, loading, error };
}
