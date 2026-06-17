import { useCallback, useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  writeBatch
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../services/firebase.js";
import { useLocalStorageState } from "./useLocalStorageState.js";

export function useFirestoreCollection(collectionName, initialValue) {
  const [localValue, setLocalValue] = useLocalStorageState(`sportfit-${collectionName}`, initialValue);
  const [remoteValue, setRemoteValue] = useState(initialValue);
  const [status, setStatus] = useState(isFirebaseConfigured ? "Conectando ao Firebase..." : "Modo demo local");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined;
    }

    const unsubscribe = onSnapshot(
      query(collection(db, collectionName)),
      async (snapshot) => {
        if (snapshot.empty && initialValue.length > 0) {
          await Promise.all(initialValue.map((item) => setDoc(doc(db, collectionName, item.id), item)));
          return;
        }

        const records = snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        }));

        setRemoteValue(records);
        setStatus("Firebase conectado");
      },
      (error) => {
        console.error(`Erro ao ler ${collectionName} no Firebase`, error);
        setStatus("Erro no Firebase. Verifique regras e credenciais.");
      }
    );

    return unsubscribe;
  }, [collectionName, initialValue]);

  const value = isFirebaseConfigured ? remoteValue : localValue;

  const setValue = useCallback(
    async (nextValueOrUpdater) => {
      if (!isFirebaseConfigured) {
        setLocalValue(nextValueOrUpdater);
        return;
      }

      const nextValue =
        typeof nextValueOrUpdater === "function"
          ? nextValueOrUpdater(remoteValue)
          : nextValueOrUpdater;

      setRemoteValue(nextValue);

      const batch = writeBatch(db);
      const previousIds = new Set(remoteValue.map((item) => item.id));
      const nextIds = new Set(nextValue.map((item) => item.id));

      nextValue.forEach((item) => {
        batch.set(doc(db, collectionName, item.id), item);
      });

      previousIds.forEach((id) => {
        if (!nextIds.has(id)) {
          batch.delete(doc(db, collectionName, id));
        }
      });

      try {
        await batch.commit();
      } catch (error) {
        console.error(`Erro ao salvar ${collectionName} no Firebase`, error);
        setStatus("Erro ao salvar no Firebase. Verifique regras do Firestore.");
      }
    },
    [collectionName, remoteValue, setLocalValue]
  );

  return useMemo(() => [value, setValue, status], [value, setValue, status]);
}
