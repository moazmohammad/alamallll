import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  category: string;
  subcategory?: string;
  badge?: string;
  description?: string;
  inStock: boolean;
  reviews?: number;
  stock: number;
  sales?: number;
}

export async function getProductsFromFirestore(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => doc.data() as Product);
}
