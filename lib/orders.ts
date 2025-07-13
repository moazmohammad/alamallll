import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id?: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: string;
  date: string;
  notes?: string;
  coupon?: string;
  createdAt?: Timestamp;
}

export async function addOrderToFirestore(order: Omit<Order, 'id'>) {
  try {
    const orderWithTimestamp = {
      ...order,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderWithTimestamp);
    return { ...orderWithTimestamp, id: docRef.id };
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
}

export async function getOrdersByCustomer(phone: string) {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('phone', '==', phone),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  } catch (error) {
    console.error('Error getting customer orders:', error);
    throw error;
  }
}
