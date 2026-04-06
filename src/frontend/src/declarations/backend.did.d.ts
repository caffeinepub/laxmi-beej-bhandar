/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export type UnitType = { 'Bags': null } | { 'Packets': null } | { 'Kg': null } | { 'Grams': null };
export type PaymentStatus = { 'Paid': null } | { 'Unpaid': null } | { 'Partial': null };
export type UserRole = { 'Admin': null } | { 'Staff': null };

export interface UserProfile {
  id: bigint;
  firstName: string;
  lastName: string;
  phone: string;
  storeName: string;
  passwordHash: string;
  profilePhotoUrl: string;
  role: UserRole;
}

export interface Transaction {
  id: bigint;
  purchaseDate: string;
  amountPaid: number;
  amountDue: number;
  unitRate: number;
  quantity: number;
  unit: UnitType;
  seedType: string;
  dueDate: string;
  paymentDate: string;
  notes: string;
}

export interface Customer {
  id: bigint;
  name: string;
  address: string;
  phone: string;
  notes: string;
  transactions: Array<Transaction>;
}

export interface Supplier {
  id: bigint;
  name: string;
  address: string;
  phone: string;
  notes: string;
  transactions: Array<Transaction>;
}

export interface StockItem {
  id: bigint;
  productName: string;
  seedCategory: string;
  quantityBags: number;
  quantityPackets: number;
  quantityKg: number;
  quantityGrams: number;
  costPrice: number;
  sellPrice: number;
  imageUrl: string;
  description: string;
  reorderLevel: number;
}

export interface BillLineItem {
  productName: string;
  quantity: number;
  unit: UnitType;
  unitRate: number;
  amount: number;
}

export interface Bill {
  id: bigint;
  customerId: bigint;
  customerName: string;
  address: string;
  phone: string;
  purchaseDate: string;
  dueDate: string;
  paymentDate: string;
  lineItems: Array<BillLineItem>;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  status: PaymentStatus;
}

export interface MonthlySales {
  id: bigint;
  year: bigint;
  month: bigint;
  totalSales: number;
  totalPurchases: number;
  profit: number;
}

export interface SeedCatalog {
  id: bigint;
  name: string;
  category: string;
  description: string;
  season: string;
  region: string;
}

export interface _SERVICE {
  createUser: ActorMethod<[string, string, string, string, string], [UserProfile] | []>;
  getUserByPhone: ActorMethod<[string], [UserProfile] | []>;
  updateUserProfile: ActorMethod<[bigint, string, string, string], boolean>;
  updateUserPassword: ActorMethod<[bigint, string], boolean>;
  updateUserPhoto: ActorMethod<[bigint, string], boolean>;
  getAllUsers: ActorMethod<[], Array<UserProfile>>;
  createCustomer: ActorMethod<[string, string, string, string], Customer>;
  getAllCustomers: ActorMethod<[], Array<Customer>>;
  getCustomer: ActorMethod<[bigint], [Customer] | []>;
  updateCustomer: ActorMethod<[bigint, string, string, string, string], boolean>;
  deleteCustomer: ActorMethod<[bigint], boolean>;
  addCustomerTransaction: ActorMethod<[bigint, string, number, number, number, number, UnitType, string, string, string, string], boolean>;
  getCustomerAnnualTotal: ActorMethod<[bigint, string], number>;
  createSupplier: ActorMethod<[string, string, string, string], Supplier>;
  getAllSuppliers: ActorMethod<[], Array<Supplier>>;
  getSupplier: ActorMethod<[bigint], [Supplier] | []>;
  updateSupplier: ActorMethod<[bigint, string, string, string, string], boolean>;
  deleteSupplier: ActorMethod<[bigint], boolean>;
  addSupplierTransaction: ActorMethod<[bigint, string, number, number, number, number, UnitType, string, string, string, string], boolean>;
  createStockItem: ActorMethod<[string, string, number, number, number, number, number, number, string, string, number], StockItem>;
  getAllStockItems: ActorMethod<[], Array<StockItem>>;
  getStockItem: ActorMethod<[bigint], [StockItem] | []>;
  updateStockItem: ActorMethod<[bigint, string, string, number, number, number, number, number, number, string, string, number], boolean>;
  deleteStockItem: ActorMethod<[bigint], boolean>;
  createBill: ActorMethod<[bigint, string, string, string, string, string, string, Array<BillLineItem>, number, number, number, number, PaymentStatus], Bill>;
  getAllBills: ActorMethod<[], Array<Bill>>;
  getBillsByCustomer: ActorMethod<[bigint], Array<Bill>>;
  updateBillStatus: ActorMethod<[bigint, PaymentStatus, string], boolean>;
  upsertMonthlySales: ActorMethod<[bigint, bigint, number, number], MonthlySales>;
  getMonthlySalesByYear: ActorMethod<[bigint], Array<MonthlySales>>;
  getAllMonthlySales: ActorMethod<[], Array<MonthlySales>>;
  getAnnualSummary: ActorMethod<[string], [number, number, number]>;
  getAllSeedCatalog: ActorMethod<[], Array<SeedCatalog>>;
  addSeedCatalog: ActorMethod<[string, string, string, string, string], SeedCatalog>;
  deleteSeedCatalog: ActorMethod<[bigint], boolean>;
}

export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
