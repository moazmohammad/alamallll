import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

export interface MenuItem {
  id: number;
  name: string;
  url: string;
  parentId?: number;
  order: number;
  isActive: boolean;
  iconUrl?: string; // Optional field for icon URL
}

const MENUS_COLLECTION = "menus";

export async function getMenus(): Promise<MenuItem[]> {
  const snapshot = await getDocs(collection(db, MENUS_COLLECTION));
  return snapshot.docs.map((doc) => doc.data() as MenuItem);
}

export async function saveMenus(menus: MenuItem[]): Promise<void> {
  // Overwrite all menus (simple approach)
  const batch = menus.map(async (menu) => {
    await setDoc(doc(db, MENUS_COLLECTION, menu.id.toString()), menu);
  });
  await Promise.all(batch);
}

export async function addMenu(menu: MenuItem): Promise<void> {
  await setDoc(doc(db, MENUS_COLLECTION, menu.id.toString()), menu);
}

export async function updateMenu(menu: MenuItem): Promise<void> {
  await setDoc(doc(db, MENUS_COLLECTION, menu.id.toString()), menu);
}

export async function deleteMenu(id: number): Promise<void> {
  await deleteDoc(doc(db, MENUS_COLLECTION, id.toString()));
}