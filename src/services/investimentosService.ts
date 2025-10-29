import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Nome da coleção no Firestore
const COLLECTION_NAME = "investimentos";

// 🔹 Criar um novo investimento
export async function addInvestimento(investimento: any) {
  await addDoc(collection(db, COLLECTION_NAME), investimento);
}

// 🔹 Listar todos os investimentos
export async function getInvestimentos() {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 🔹 Atualizar um investimento
export async function updateInvestimento(id: string, novosDados: any) {
  const ref = doc(db, COLLECTION_NAME, id);
  await updateDoc(ref, novosDados);
}

// 🔹 Excluir um investimento
export async function deleteInvestimento(id: string) {
  const ref = doc(db, COLLECTION_NAME, id);
  await deleteDoc(ref);
}
