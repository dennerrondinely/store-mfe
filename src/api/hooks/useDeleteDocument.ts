import { useState } from "react";
import { deleteDoc, doc, db } from "../firebase";

interface UseDeleteDocumentReturn {
  deleteDocument: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useDeleteDocument(
  collectionName: string
): UseDeleteDocumentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocument = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteDocument, loading, error };
}
