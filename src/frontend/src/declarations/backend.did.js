/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

const UnitType = IDL.Variant({ 'Bags': IDL.Null, 'Packets': IDL.Null, 'Kg': IDL.Null, 'Grams': IDL.Null });
const PaymentStatus = IDL.Variant({ 'Paid': IDL.Null, 'Unpaid': IDL.Null, 'Partial': IDL.Null });
const UserRole = IDL.Variant({ 'Admin': IDL.Null, 'Staff': IDL.Null });

const UserProfile = IDL.Record({
  id: IDL.Nat,
  firstName: IDL.Text,
  lastName: IDL.Text,
  phone: IDL.Text,
  storeName: IDL.Text,
  passwordHash: IDL.Text,
  profilePhotoUrl: IDL.Text,
  role: UserRole,
});

const Transaction = IDL.Record({
  id: IDL.Nat,
  purchaseDate: IDL.Text,
  amountPaid: IDL.Float64,
  amountDue: IDL.Float64,
  unitRate: IDL.Float64,
  quantity: IDL.Float64,
  unit: UnitType,
  seedType: IDL.Text,
  dueDate: IDL.Text,
  paymentDate: IDL.Text,
  notes: IDL.Text,
});

const Customer = IDL.Record({
  id: IDL.Nat,
  name: IDL.Text,
  address: IDL.Text,
  phone: IDL.Text,
  notes: IDL.Text,
  transactions: IDL.Vec(Transaction),
});

const Supplier = IDL.Record({
  id: IDL.Nat,
  name: IDL.Text,
  address: IDL.Text,
  phone: IDL.Text,
  notes: IDL.Text,
  transactions: IDL.Vec(Transaction),
});

const StockItem = IDL.Record({
  id: IDL.Nat,
  productName: IDL.Text,
  seedCategory: IDL.Text,
  quantityBags: IDL.Float64,
  quantityPackets: IDL.Float64,
  quantityKg: IDL.Float64,
  quantityGrams: IDL.Float64,
  costPrice: IDL.Float64,
  sellPrice: IDL.Float64,
  imageUrl: IDL.Text,
  description: IDL.Text,
  reorderLevel: IDL.Float64,
});

const BillLineItem = IDL.Record({
  productName: IDL.Text,
  quantity: IDL.Float64,
  unit: UnitType,
  unitRate: IDL.Float64,
  amount: IDL.Float64,
});

const Bill = IDL.Record({
  id: IDL.Nat,
  customerId: IDL.Nat,
  customerName: IDL.Text,
  address: IDL.Text,
  phone: IDL.Text,
  purchaseDate: IDL.Text,
  dueDate: IDL.Text,
  paymentDate: IDL.Text,
  lineItems: IDL.Vec(BillLineItem),
  totalAmount: IDL.Float64,
  discount: IDL.Float64,
  tax: IDL.Float64,
  finalAmount: IDL.Float64,
  status: PaymentStatus,
});

const MonthlySales = IDL.Record({
  id: IDL.Nat,
  year: IDL.Nat,
  month: IDL.Nat,
  totalSales: IDL.Float64,
  totalPurchases: IDL.Float64,
  profit: IDL.Float64,
});

const SeedCatalog = IDL.Record({
  id: IDL.Nat,
  name: IDL.Text,
  category: IDL.Text,
  description: IDL.Text,
  season: IDL.Text,
  region: IDL.Text,
});

export const idlService = IDL.Service({
  // User Management
  createUser: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Opt(UserProfile)], []),
  getUserByPhone: IDL.Func([IDL.Text], [IDL.Opt(UserProfile)], ['query']),
  updateUserProfile: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  updateUserPassword: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
  updateUserPhoto: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
  getAllUsers: IDL.Func([], [IDL.Vec(UserProfile)], ['query']),
  // Customer Management
  createCustomer: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [Customer], []),
  getAllCustomers: IDL.Func([], [IDL.Vec(Customer)], ['query']),
  getCustomer: IDL.Func([IDL.Nat], [IDL.Opt(Customer)], ['query']),
  updateCustomer: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  deleteCustomer: IDL.Func([IDL.Nat], [IDL.Bool], []),
  addCustomerTransaction: IDL.Func([IDL.Nat, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, UnitType, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  getCustomerAnnualTotal: IDL.Func([IDL.Nat, IDL.Text], [IDL.Float64], ['query']),
  // Supplier Management
  createSupplier: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [Supplier], []),
  getAllSuppliers: IDL.Func([], [IDL.Vec(Supplier)], ['query']),
  getSupplier: IDL.Func([IDL.Nat], [IDL.Opt(Supplier)], ['query']),
  updateSupplier: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  deleteSupplier: IDL.Func([IDL.Nat], [IDL.Bool], []),
  addSupplierTransaction: IDL.Func([IDL.Nat, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, UnitType, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
  // Stock Management
  createStockItem: IDL.Func([IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text, IDL.Text, IDL.Float64], [StockItem], []),
  getAllStockItems: IDL.Func([], [IDL.Vec(StockItem)], ['query']),
  getStockItem: IDL.Func([IDL.Nat], [IDL.Opt(StockItem)], ['query']),
  updateStockItem: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text, IDL.Text, IDL.Float64], [IDL.Bool], []),
  deleteStockItem: IDL.Func([IDL.Nat], [IDL.Bool], []),
  // Billing
  createBill: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Vec(BillLineItem), IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, PaymentStatus], [Bill], []),
  getAllBills: IDL.Func([], [IDL.Vec(Bill)], ['query']),
  getBillsByCustomer: IDL.Func([IDL.Nat], [IDL.Vec(Bill)], ['query']),
  updateBillStatus: IDL.Func([IDL.Nat, PaymentStatus, IDL.Text], [IDL.Bool], []),
  // Analytics
  upsertMonthlySales: IDL.Func([IDL.Nat, IDL.Nat, IDL.Float64, IDL.Float64], [MonthlySales], []),
  getMonthlySalesByYear: IDL.Func([IDL.Nat], [IDL.Vec(MonthlySales)], ['query']),
  getAllMonthlySales: IDL.Func([], [IDL.Vec(MonthlySales)], ['query']),
  getAnnualSummary: IDL.Func([IDL.Text], [IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64)], ['query']),
  // Seed Catalog
  getAllSeedCatalog: IDL.Func([], [IDL.Vec(SeedCatalog)], ['query']),
  addSeedCatalog: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [SeedCatalog], []),
  deleteSeedCatalog: IDL.Func([IDL.Nat], [IDL.Bool], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const UnitType = IDL.Variant({ 'Bags': IDL.Null, 'Packets': IDL.Null, 'Kg': IDL.Null, 'Grams': IDL.Null });
  const PaymentStatus = IDL.Variant({ 'Paid': IDL.Null, 'Unpaid': IDL.Null, 'Partial': IDL.Null });
  const UserRole = IDL.Variant({ 'Admin': IDL.Null, 'Staff': IDL.Null });

  const UserProfile = IDL.Record({
    id: IDL.Nat,
    firstName: IDL.Text,
    lastName: IDL.Text,
    phone: IDL.Text,
    storeName: IDL.Text,
    passwordHash: IDL.Text,
    profilePhotoUrl: IDL.Text,
    role: UserRole,
  });

  const Transaction = IDL.Record({
    id: IDL.Nat,
    purchaseDate: IDL.Text,
    amountPaid: IDL.Float64,
    amountDue: IDL.Float64,
    unitRate: IDL.Float64,
    quantity: IDL.Float64,
    unit: UnitType,
    seedType: IDL.Text,
    dueDate: IDL.Text,
    paymentDate: IDL.Text,
    notes: IDL.Text,
  });

  const Customer = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    address: IDL.Text,
    phone: IDL.Text,
    notes: IDL.Text,
    transactions: IDL.Vec(Transaction),
  });

  const Supplier = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    address: IDL.Text,
    phone: IDL.Text,
    notes: IDL.Text,
    transactions: IDL.Vec(Transaction),
  });

  const StockItem = IDL.Record({
    id: IDL.Nat,
    productName: IDL.Text,
    seedCategory: IDL.Text,
    quantityBags: IDL.Float64,
    quantityPackets: IDL.Float64,
    quantityKg: IDL.Float64,
    quantityGrams: IDL.Float64,
    costPrice: IDL.Float64,
    sellPrice: IDL.Float64,
    imageUrl: IDL.Text,
    description: IDL.Text,
    reorderLevel: IDL.Float64,
  });

  const BillLineItem = IDL.Record({
    productName: IDL.Text,
    quantity: IDL.Float64,
    unit: UnitType,
    unitRate: IDL.Float64,
    amount: IDL.Float64,
  });

  const Bill = IDL.Record({
    id: IDL.Nat,
    customerId: IDL.Nat,
    customerName: IDL.Text,
    address: IDL.Text,
    phone: IDL.Text,
    purchaseDate: IDL.Text,
    dueDate: IDL.Text,
    paymentDate: IDL.Text,
    lineItems: IDL.Vec(BillLineItem),
    totalAmount: IDL.Float64,
    discount: IDL.Float64,
    tax: IDL.Float64,
    finalAmount: IDL.Float64,
    status: PaymentStatus,
  });

  const MonthlySales = IDL.Record({
    id: IDL.Nat,
    year: IDL.Nat,
    month: IDL.Nat,
    totalSales: IDL.Float64,
    totalPurchases: IDL.Float64,
    profit: IDL.Float64,
  });

  const SeedCatalog = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    category: IDL.Text,
    description: IDL.Text,
    season: IDL.Text,
    region: IDL.Text,
  });

  return IDL.Service({
    createUser: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Opt(UserProfile)], []),
    getUserByPhone: IDL.Func([IDL.Text], [IDL.Opt(UserProfile)], ['query']),
    updateUserProfile: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    updateUserPassword: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    updateUserPhoto: IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    getAllUsers: IDL.Func([], [IDL.Vec(UserProfile)], ['query']),
    createCustomer: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [Customer], []),
    getAllCustomers: IDL.Func([], [IDL.Vec(Customer)], ['query']),
    getCustomer: IDL.Func([IDL.Nat], [IDL.Opt(Customer)], ['query']),
    updateCustomer: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    deleteCustomer: IDL.Func([IDL.Nat], [IDL.Bool], []),
    addCustomerTransaction: IDL.Func([IDL.Nat, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, UnitType, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    getCustomerAnnualTotal: IDL.Func([IDL.Nat, IDL.Text], [IDL.Float64], ['query']),
    createSupplier: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [Supplier], []),
    getAllSuppliers: IDL.Func([], [IDL.Vec(Supplier)], ['query']),
    getSupplier: IDL.Func([IDL.Nat], [IDL.Opt(Supplier)], ['query']),
    updateSupplier: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    deleteSupplier: IDL.Func([IDL.Nat], [IDL.Bool], []),
    addSupplierTransaction: IDL.Func([IDL.Nat, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, UnitType, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    createStockItem: IDL.Func([IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text, IDL.Text, IDL.Float64], [StockItem], []),
    getAllStockItems: IDL.Func([], [IDL.Vec(StockItem)], ['query']),
    getStockItem: IDL.Func([IDL.Nat], [IDL.Opt(StockItem)], ['query']),
    updateStockItem: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text, IDL.Text, IDL.Float64], [IDL.Bool], []),
    deleteStockItem: IDL.Func([IDL.Nat], [IDL.Bool], []),
    createBill: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Vec(BillLineItem), IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, PaymentStatus], [Bill], []),
    getAllBills: IDL.Func([], [IDL.Vec(Bill)], ['query']),
    getBillsByCustomer: IDL.Func([IDL.Nat], [IDL.Vec(Bill)], ['query']),
    updateBillStatus: IDL.Func([IDL.Nat, PaymentStatus, IDL.Text], [IDL.Bool], []),
    upsertMonthlySales: IDL.Func([IDL.Nat, IDL.Nat, IDL.Float64, IDL.Float64], [MonthlySales], []),
    getMonthlySalesByYear: IDL.Func([IDL.Nat], [IDL.Vec(MonthlySales)], ['query']),
    getAllMonthlySales: IDL.Func([], [IDL.Vec(MonthlySales)], ['query']),
    getAnnualSummary: IDL.Func([IDL.Text], [IDL.Tuple(IDL.Float64, IDL.Float64, IDL.Float64)], ['query']),
    getAllSeedCatalog: IDL.Func([], [IDL.Vec(SeedCatalog)], ['query']),
    addSeedCatalog: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [SeedCatalog], []),
    deleteSeedCatalog: IDL.Func([IDL.Nat], [IDL.Bool], []),
  });
};

export const init = ({ IDL }) => { return []; };
