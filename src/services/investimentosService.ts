import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { Investimento } from "../types/Investimento"; // 👈
import { db } from "./firebaseConfig";

const COLLECTION_NAME = "investimentos";

export async function addInvestimento(investimento: Omit<Investimento, "id">) {
  await addDoc(collection(db, COLLECTION_NAME), investimento);
}

export async function getInvestimentos(): Promise<Investimento[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Investimento, "id">),
  }));
}

export async function updateInvestimento(id: string, novosDados: Partial<Investimento>) {
  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, novosDados);
}

export async function deleteInvestimento(id: string) {
  const ref = doc(db, COLLECTION_NAME, id);
  await deleteDoc(ref);
}
