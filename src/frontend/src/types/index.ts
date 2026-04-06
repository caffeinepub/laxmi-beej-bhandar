// Central types for the Laxmi Beej Bhandar app

export type UnitType = "Bags" | "Packets" | "Kg" | "Grams";

export type PaymentStatus = "Paid" | "Unpaid" | "Partial";

export interface Transaction {
  id: string;
  date: string;
  seedType: string;
  quantity: number;
  unit: UnitType;
  unitRate: number;
  amountPaid: number;
  amountDue: number;
  dueDate: string;
  paymentDate: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes?: string;
  transactions: Transaction[];
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  notes?: string;
  transactions: Transaction[];
}

export interface StockItem {
  id: string;
  name: string;
  category: string;
  bags: number;
  packets: number;
  kg: number;
  grams: number;
  costPrice: number;
  sellPrice: number;
  reorderLevel: number;
  description?: string;
  imageUrl?: string;
}

export interface BillLineItem {
  id: string;
  productName: string;
  quantity: number;
  unit: UnitType;
  unitRate: number;
  amount: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  purchaseDate: string;
  dueDate: string;
  paymentDate: string;
  lineItems: BillLineItem[];
  discount: number;
  tax: number;
  totalAmount: number;
  finalAmount: number;
  status: PaymentStatus;
}

export interface SeedCatalogItem {
  id: string;
  name: string;
  category: "Cereal" | "Vegetable" | "Oilseed" | "Pulse";
  description: string;
  season: string;
  region: string;
}

export interface SecurityAnswer {
  question: string;
  answer: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  storeName: string;
  address: string;
  password: string;
  profilePhoto?: string;
  securityAnswers?: SecurityAnswer[];
}

export interface AppData {
  customers: Customer[];
  suppliers: Supplier[];
  stock: StockItem[];
  bills: Bill[];
  seedCatalog: SeedCatalogItem[];
}

export const SECURITY_QUESTIONS = [
  "What was the name of your high school?",
  "What is your pet's name?",
  "Who was your childhood hero?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is the name of the city where you were born?",
  "What was the name of your best childhood friend?",
];
