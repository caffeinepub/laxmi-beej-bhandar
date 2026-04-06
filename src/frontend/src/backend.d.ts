import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export type UnitType = { Bags: null } | { Packets: null } | { Kg: null } | { Grams: null };
export type PaymentStatus = { Paid: null } | { Unpaid: null } | { Partial: null };
export type UserRole = { Admin: null } | { Staff: null };

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
    transactions: Transaction[];
}

export interface Supplier {
    id: bigint;
    name: string;
    address: string;
    phone: string;
    notes: string;
    transactions: Transaction[];
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
    lineItems: BillLineItem[];
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

export interface backendInterface {
    // User Management
    createUser(firstName: string, lastName: string, phone: string, storeName: string, passwordHash: string): Promise<Option<UserProfile>>;
    getUserByPhone(phone: string): Promise<Option<UserProfile>>;
    updateUserProfile(id: bigint, firstName: string, lastName: string, storeName: string): Promise<boolean>;
    updateUserPassword(id: bigint, newPasswordHash: string): Promise<boolean>;
    updateUserPhoto(id: bigint, photoUrl: string): Promise<boolean>;
    getAllUsers(): Promise<UserProfile[]>;

    // Customer Management
    createCustomer(name: string, address: string, phone: string, notes: string): Promise<Customer>;
    getAllCustomers(): Promise<Customer[]>;
    getCustomer(id: bigint): Promise<Option<Customer>>;
    updateCustomer(id: bigint, name: string, address: string, phone: string, notes: string): Promise<boolean>;
    deleteCustomer(id: bigint): Promise<boolean>;
    addCustomerTransaction(customerId: bigint, purchaseDate: string, amountPaid: number, amountDue: number, unitRate: number, quantity: number, unit: UnitType, seedType: string, dueDate: string, paymentDate: string, notes: string): Promise<boolean>;
    getCustomerAnnualTotal(customerId: bigint, year: string): Promise<number>;

    // Supplier Management
    createSupplier(name: string, address: string, phone: string, notes: string): Promise<Supplier>;
    getAllSuppliers(): Promise<Supplier[]>;
    getSupplier(id: bigint): Promise<Option<Supplier>>;
    updateSupplier(id: bigint, name: string, address: string, phone: string, notes: string): Promise<boolean>;
    deleteSupplier(id: bigint): Promise<boolean>;
    addSupplierTransaction(supplierId: bigint, purchaseDate: string, amountPaid: number, amountDue: number, unitRate: number, quantity: number, unit: UnitType, seedType: string, dueDate: string, paymentDate: string, notes: string): Promise<boolean>;

    // Stock Management
    createStockItem(productName: string, seedCategory: string, quantityBags: number, quantityPackets: number, quantityKg: number, quantityGrams: number, costPrice: number, sellPrice: number, imageUrl: string, description: string, reorderLevel: number): Promise<StockItem>;
    getAllStockItems(): Promise<StockItem[]>;
    getStockItem(id: bigint): Promise<Option<StockItem>>;
    updateStockItem(id: bigint, productName: string, seedCategory: string, quantityBags: number, quantityPackets: number, quantityKg: number, quantityGrams: number, costPrice: number, sellPrice: number, imageUrl: string, description: string, reorderLevel: number): Promise<boolean>;
    deleteStockItem(id: bigint): Promise<boolean>;

    // Billing
    createBill(customerId: bigint, customerName: string, address: string, phone: string, purchaseDate: string, dueDate: string, paymentDate: string, lineItems: BillLineItem[], totalAmount: number, discount: number, tax: number, finalAmount: number, status: PaymentStatus): Promise<Bill>;
    getAllBills(): Promise<Bill[]>;
    getBillsByCustomer(customerId: bigint): Promise<Bill[]>;
    updateBillStatus(id: bigint, status: PaymentStatus, paymentDate: string): Promise<boolean>;

    // Analytics
    upsertMonthlySales(year: bigint, month: bigint, totalSales: number, totalPurchases: number): Promise<MonthlySales>;
    getMonthlySalesByYear(year: bigint): Promise<MonthlySales[]>;
    getAllMonthlySales(): Promise<MonthlySales[]>;
    getAnnualSummary(year: string): Promise<[number, number, number]>;

    // Seed Catalog
    getAllSeedCatalog(): Promise<SeedCatalog[]>;
    addSeedCatalog(name: string, category: string, description: string, season: string, region: string): Promise<SeedCatalog>;
    deleteSeedCatalog(id: bigint): Promise<boolean>;
}
