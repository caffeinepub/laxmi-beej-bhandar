/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

function some<T>(value: T): Some<T> {
    return { __kind__: "Some", value };
}
function none(): None {
    return { __kind__: "None" };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) throw new Error("unwrap: none");
    return option.value;
}

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null) {
        if (blob) this._blob = blob;
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) return this._blob;
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string {
        return this.directURL;
    }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

export type UnitType = { Bags: null } | { Packets: null } | { Kg: null } | { Grams: null };
export type PaymentStatus = { Paid: null } | { Unpaid: null } | { Partial: null };
export type UserRole = { Admin: null } | { Staff: null };

export interface BackendUserProfile {
    id: bigint;
    firstName: string;
    lastName: string;
    phone: string;
    storeName: string;
    passwordHash: string;
    profilePhotoUrl: string;
    role: UserRole;
}

export interface BackendTransaction {
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

export interface BackendCustomer {
    id: bigint;
    name: string;
    address: string;
    phone: string;
    notes: string;
    transactions: BackendTransaction[];
}

export interface BackendSupplier {
    id: bigint;
    name: string;
    address: string;
    phone: string;
    notes: string;
    transactions: BackendTransaction[];
}

export interface BackendStockItem {
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

export interface BackendBillLineItem {
    productName: string;
    quantity: number;
    unit: UnitType;
    unitRate: number;
    amount: number;
}

export interface BackendBill {
    id: bigint;
    customerId: bigint;
    customerName: string;
    address: string;
    phone: string;
    purchaseDate: string;
    dueDate: string;
    paymentDate: string;
    lineItems: BackendBillLineItem[];
    totalAmount: number;
    discount: number;
    tax: number;
    finalAmount: number;
    status: PaymentStatus;
}

export interface BackendMonthlySales {
    id: bigint;
    year: bigint;
    month: bigint;
    totalSales: number;
    totalPurchases: number;
    profit: number;
}

export interface BackendSeedCatalog {
    id: bigint;
    name: string;
    category: string;
    description: string;
    season: string;
    region: string;
}

export interface backendInterface {
    // User Management
    createUser(firstName: string, lastName: string, phone: string, storeName: string, passwordHash: string): Promise<[BackendUserProfile] | []>;
    getUserByPhone(phone: string): Promise<[BackendUserProfile] | []>;
    updateUserProfile(id: bigint, firstName: string, lastName: string, storeName: string): Promise<boolean>;
    updateUserPassword(id: bigint, newPasswordHash: string): Promise<boolean>;
    updateUserPhoto(id: bigint, photoUrl: string): Promise<boolean>;
    getAllUsers(): Promise<BackendUserProfile[]>;
    // Customer Management
    createCustomer(name: string, address: string, phone: string, notes: string): Promise<BackendCustomer>;
    getAllCustomers(): Promise<BackendCustomer[]>;
    getCustomer(id: bigint): Promise<[BackendCustomer] | []>;
    updateCustomer(id: bigint, name: string, address: string, phone: string, notes: string): Promise<boolean>;
    deleteCustomer(id: bigint): Promise<boolean>;
    addCustomerTransaction(customerId: bigint, purchaseDate: string, amountPaid: number, amountDue: number, unitRate: number, quantity: number, unit: UnitType, seedType: string, dueDate: string, paymentDate: string, notes: string): Promise<boolean>;
    getCustomerAnnualTotal(customerId: bigint, year: string): Promise<number>;
    // Supplier Management
    createSupplier(name: string, address: string, phone: string, notes: string): Promise<BackendSupplier>;
    getAllSuppliers(): Promise<BackendSupplier[]>;
    getSupplier(id: bigint): Promise<[BackendSupplier] | []>;
    updateSupplier(id: bigint, name: string, address: string, phone: string, notes: string): Promise<boolean>;
    deleteSupplier(id: bigint): Promise<boolean>;
    addSupplierTransaction(supplierId: bigint, purchaseDate: string, amountPaid: number, amountDue: number, unitRate: number, quantity: number, unit: UnitType, seedType: string, dueDate: string, paymentDate: string, notes: string): Promise<boolean>;
    // Stock Management
    createStockItem(productName: string, seedCategory: string, quantityBags: number, quantityPackets: number, quantityKg: number, quantityGrams: number, costPrice: number, sellPrice: number, imageUrl: string, description: string, reorderLevel: number): Promise<BackendStockItem>;
    getAllStockItems(): Promise<BackendStockItem[]>;
    getStockItem(id: bigint): Promise<[BackendStockItem] | []>;
    updateStockItem(id: bigint, productName: string, seedCategory: string, quantityBags: number, quantityPackets: number, quantityKg: number, quantityGrams: number, costPrice: number, sellPrice: number, imageUrl: string, description: string, reorderLevel: number): Promise<boolean>;
    deleteStockItem(id: bigint): Promise<boolean>;
    // Billing
    createBill(customerId: bigint, customerName: string, address: string, phone: string, purchaseDate: string, dueDate: string, paymentDate: string, lineItems: BackendBillLineItem[], totalAmount: number, discount: number, tax: number, finalAmount: number, status: PaymentStatus): Promise<BackendBill>;
    getAllBills(): Promise<BackendBill[]>;
    getBillsByCustomer(customerId: bigint): Promise<BackendBill[]>;
    updateBillStatus(id: bigint, status: PaymentStatus, paymentDate: string): Promise<boolean>;
    // Analytics
    upsertMonthlySales(year: bigint, month: bigint, totalSales: number, totalPurchases: number): Promise<BackendMonthlySales>;
    getMonthlySalesByYear(year: bigint): Promise<BackendMonthlySales[]>;
    getAllMonthlySales(): Promise<BackendMonthlySales[]>;
    getAnnualSummary(year: string): Promise<[number, number, number]>;
    // Seed Catalog
    getAllSeedCatalog(): Promise<BackendSeedCatalog[]>;
    addSeedCatalog(name: string, category: string, description: string, season: string, region: string): Promise<BackendSeedCatalog>;
    deleteSeedCatalog(id: bigint): Promise<boolean>;
}

export class Backend implements backendInterface {
    constructor(
        private actor: ActorSubclass<_SERVICE>,
        private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
        private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
        private processError?: (error: unknown) => never
    ) {}

    private handle<T>(promise: Promise<T>): Promise<T> {
        if (this.processError) {
            return promise.catch(this.processError);
        }
        return promise;
    }

    createUser(firstName: string, lastName: string, phone: string, storeName: string, passwordHash: string) {
        return this.handle(this.actor.createUser(firstName, lastName, phone, storeName, passwordHash));
    }
    getUserByPhone(phone: string) {
        return this.handle(this.actor.getUserByPhone(phone));
    }
    updateUserProfile(id: bigint, firstName: string, lastName: string, storeName: string) {
        return this.handle(this.actor.updateUserProfile(id, firstName, lastName, storeName));
    }
    updateUserPassword(id: bigint, newPasswordHash: string) {
        return this.handle(this.actor.updateUserPassword(id, newPasswordHash));
    }
    updateUserPhoto(id: bigint, photoUrl: string) {
        return this.handle(this.actor.updateUserPhoto(id, photoUrl));
    }
    getAllUsers() {
        return this.handle(this.actor.getAllUsers());
    }
    createCustomer(name: string, address: string, phone: string, notes: string) {
        return this.handle(this.actor.createCustomer(name, address, phone, notes));
    }
    getAllCustomers() {
        return this.handle(this.actor.getAllCustomers());
    }
    getCustomer(id: bigint) {
        return this.handle(this.actor.getCustomer(id));
    }
    updateCustomer(id: bigint, name: string, address: string, phone: string, notes: string) {
        return this.handle(this.actor.updateCustomer(id, name, address, phone, notes));
    }
    deleteCustomer(id: bigint) {
        return this.handle(this.actor.deleteCustomer(id));
    }
    addCustomerTransaction(customerId: bigint, purchaseDate: string, amountPaid: number, amountDue: number, unitRate: number, quantity: number, unit: UnitType, seedType: string, dueDate: string, paymentDate: string, notes: string) {
        return this.handle(this.actor.addCustomerTransaction(customerId, purchaseDate, amountPaid, amountDue, unitRate, quantity, unit, seedType, dueDate, paymentDate, notes));
    }
    getCustomerAnnualTotal(customerId: bigint, year: string) {
        return this.handle(this.actor.getCustomerAnnualTotal(customerId, year));
    }
    createSupplier(name: string, address: string, phone: string, notes: string) {
        return this.handle(this.actor.createSupplier(name, address, phone, notes));
    }
    getAllSuppliers() {
        return this.handle(this.actor.getAllSuppliers());
    }
    getSupplier(id: bigint) {
        return this.handle(this.actor.getSupplier(id));
    }
    updateSupplier(id: bigint, name: string, address: string, phone: string, notes: string) {
        return this.handle(this.actor.updateSupplier(id, name, address, phone, notes));
    }
    deleteSupplier(id: bigint) {
        return this.handle(this.actor.deleteSupplier(id));
    }
    addSupplierTransaction(supplierId: bigint, purchaseDate: string, amountPaid: number, amountDue: number, unitRate: number, quantity: number, unit: UnitType, seedType: string, dueDate: string, paymentDate: string, notes: string) {
        return this.handle(this.actor.addSupplierTransaction(supplierId, purchaseDate, amountPaid, amountDue, unitRate, quantity, unit, seedType, dueDate, paymentDate, notes));
    }
    createStockItem(productName: string, seedCategory: string, quantityBags: number, quantityPackets: number, quantityKg: number, quantityGrams: number, costPrice: number, sellPrice: number, imageUrl: string, description: string, reorderLevel: number) {
        return this.handle(this.actor.createStockItem(productName, seedCategory, quantityBags, quantityPackets, quantityKg, quantityGrams, costPrice, sellPrice, imageUrl, description, reorderLevel));
    }
    getAllStockItems() {
        return this.handle(this.actor.getAllStockItems());
    }
    getStockItem(id: bigint) {
        return this.handle(this.actor.getStockItem(id));
    }
    updateStockItem(id: bigint, productName: string, seedCategory: string, quantityBags: number, quantityPackets: number, quantityKg: number, quantityGrams: number, costPrice: number, sellPrice: number, imageUrl: string, description: string, reorderLevel: number) {
        return this.handle(this.actor.updateStockItem(id, productName, seedCategory, quantityBags, quantityPackets, quantityKg, quantityGrams, costPrice, sellPrice, imageUrl, description, reorderLevel));
    }
    deleteStockItem(id: bigint) {
        return this.handle(this.actor.deleteStockItem(id));
    }
    createBill(customerId: bigint, customerName: string, address: string, phone: string, purchaseDate: string, dueDate: string, paymentDate: string, lineItems: BackendBillLineItem[], totalAmount: number, discount: number, tax: number, finalAmount: number, status: PaymentStatus) {
        return this.handle(this.actor.createBill(customerId, customerName, address, phone, purchaseDate, dueDate, paymentDate, lineItems, totalAmount, discount, tax, finalAmount, status));
    }
    getAllBills() {
        return this.handle(this.actor.getAllBills());
    }
    getBillsByCustomer(customerId: bigint) {
        return this.handle(this.actor.getBillsByCustomer(customerId));
    }
    updateBillStatus(id: bigint, status: PaymentStatus, paymentDate: string) {
        return this.handle(this.actor.updateBillStatus(id, status, paymentDate));
    }
    upsertMonthlySales(year: bigint, month: bigint, totalSales: number, totalPurchases: number) {
        return this.handle(this.actor.upsertMonthlySales(year, month, totalSales, totalPurchases));
    }
    getMonthlySalesByYear(year: bigint) {
        return this.handle(this.actor.getMonthlySalesByYear(year));
    }
    getAllMonthlySales() {
        return this.handle(this.actor.getAllMonthlySales());
    }
    getAnnualSummary(year: string) {
        return this.handle(this.actor.getAnnualSummary(year));
    }
    getAllSeedCatalog() {
        return this.handle(this.actor.getAllSeedCatalog());
    }
    addSeedCatalog(name: string, category: string, description: string, season: string, region: string) {
        return this.handle(this.actor.addSeedCatalog(name, category, description, season, region));
    }
    deleteSeedCatalog(id: bigint) {
        return this.handle(this.actor.deleteSeedCatalog(id));
    }
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}

export function createActor(
    canisterId: string,
    _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
    _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>,
    options: CreateActorOptions = {}
): Backend {
    const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
    if (options.agent && options.agentOptions) {
        console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId,
        ...options.actorOptions,
    });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
