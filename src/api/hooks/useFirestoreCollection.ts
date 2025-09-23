/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase";

export function useFirestoreCollection<T = unknown>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = constraints.length
      ? query(collection(db, collectionName), ...constraints)
      : query(collection(db, collectionName));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: T[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as T),
        id: doc.id,
      }));

      setData(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading };
}
