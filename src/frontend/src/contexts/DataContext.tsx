import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import type { backendInterface } from "../backend";
import type {
  BackendBill,
  BackendBillLineItem,
  BackendCustomer,
  PaymentStatus as BackendPaymentStatus,
  BackendSeedCatalog,
  BackendStockItem,
  BackendSupplier,
  BackendTransaction,
  UnitType as BackendUnitType,
} from "../backend";
import type {
  AppData,
  Bill,
  BillLineItem,
  Customer,
  SeedCatalogItem,
  StockItem,
  Supplier,
  Transaction,
} from "../types";

// ---------------------------------------------------------------------------
// Type mapping helpers
// ---------------------------------------------------------------------------

function unitToBackend(u: string): BackendUnitType {
  switch (u) {
    case "Bags":
      return { Bags: null };
    case "Packets":
      return { Packets: null };
    case "Kg":
      return { Kg: null };
    case "Grams":
      return { Grams: null };
    default:
      return { Bags: null };
  }
}

function unitFromBackend(u: BackendUnitType): string {
  if ("Bags" in u) return "Bags";
  if ("Packets" in u) return "Packets";
  if ("Kg" in u) return "Kg";
  if ("Grams" in u) return "Grams";
  return "Bags";
}

function statusToBackend(s: string): BackendPaymentStatus {
  switch (s) {
    case "Paid":
      return { Paid: null };
    case "Unpaid":
      return { Unpaid: null };
    case "Partial":
      return { Partial: null };
    default:
      return { Unpaid: null };
  }
}

function statusFromBackend(s: BackendPaymentStatus): string {
  if ("Paid" in s) return "Paid";
  if ("Unpaid" in s) return "Unpaid";
  if ("Partial" in s) return "Partial";
  return "Unpaid";
}

function transactionFromBackend(t: BackendTransaction): Transaction {
  return {
    id: String(t.id),
    date: t.purchaseDate,
    seedType: t.seedType,
    quantity: t.quantity,
    unit: unitFromBackend(t.unit) as Transaction["unit"],
    unitRate: t.unitRate,
    amountPaid: t.amountPaid,
    amountDue: t.amountDue,
    dueDate: t.dueDate,
    paymentDate: t.paymentDate,
    notes: t.notes || undefined,
  };
}

function customerFromBackend(c: BackendCustomer): Customer {
  return {
    id: String(c.id),
    name: c.name,
    address: c.address,
    phone: c.phone,
    notes: c.notes || undefined,
    transactions: c.transactions.map(transactionFromBackend),
  };
}

function supplierFromBackend(s: BackendSupplier): Supplier {
  return {
    id: String(s.id),
    name: s.name,
    address: s.address,
    phone: s.phone,
    notes: s.notes || undefined,
    transactions: s.transactions.map(transactionFromBackend),
  };
}

function stockItemFromBackend(s: BackendStockItem): StockItem {
  return {
    id: String(s.id),
    name: s.productName,
    category: s.seedCategory,
    bags: s.quantityBags,
    packets: s.quantityPackets,
    kg: s.quantityKg,
    grams: s.quantityGrams,
    costPrice: s.costPrice,
    sellPrice: s.sellPrice,
    reorderLevel: s.reorderLevel,
    description: s.description || undefined,
    imageUrl: s.imageUrl || undefined,
  };
}

function billLineItemFromBackend(
  li: BackendBillLineItem,
  index: number,
): BillLineItem {
  return {
    id: `li-${index}`,
    productName: li.productName,
    quantity: li.quantity,
    unit: unitFromBackend(li.unit) as BillLineItem["unit"],
    unitRate: li.unitRate,
    amount: li.amount,
  };
}

function billFromBackend(b: BackendBill): Bill {
  return {
    id: String(b.id),
    billNumber: `LBB-${String(b.id).padStart(4, "0")}`,
    customerId: String(b.customerId),
    customerName: b.customerName,
    customerPhone: b.phone,
    customerAddress: b.address,
    purchaseDate: b.purchaseDate,
    dueDate: b.dueDate,
    paymentDate: b.paymentDate,
    lineItems: b.lineItems.map(billLineItemFromBackend),
    discount: b.discount,
    tax: b.tax,
    totalAmount: b.totalAmount,
    finalAmount: b.finalAmount,
    status: statusFromBackend(b.status) as Bill["status"],
  };
}

function seedCatalogFromBackend(s: BackendSeedCatalog): SeedCatalogItem {
  return {
    id: String(s.id),
    name: s.name,
    category: s.category as SeedCatalogItem["category"],
    description: s.description,
    season: s.season,
    region: s.region,
  };
}

// ---------------------------------------------------------------------------
// Empty initial state
// ---------------------------------------------------------------------------

const EMPTY_DATA: AppData = {
  customers: [],
  suppliers: [],
  stock: [],
  bills: [],
  seedCatalog: [],
};

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------

interface DataContextType {
  data: AppData;
  isLoading: boolean;
  // Customers
  addCustomer: (c: Omit<Customer, "id" | "transactions">) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addCustomerTransaction: (
    customerId: string,
    tx: Omit<Transaction, "id">,
  ) => void;
  // Suppliers
  addSupplier: (s: Omit<Supplier, "id" | "transactions">) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  addSupplierTransaction: (
    supplierId: string,
    tx: Omit<Transaction, "id">,
  ) => void;
  // Stock
  addStockItem: (item: Omit<StockItem, "id">) => void;
  updateStockItem: (id: string, updates: Partial<StockItem>) => void;
  deleteStockItem: (id: string) => void;
  // Bills
  addBill: (bill: Omit<Bill, "id" | "billNumber">) => void;
  updateBillStatus: (id: string, status: Bill["status"]) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  // Seeds
  addSeedCatalogItem: (item: Omit<SeedCatalogItem, "id">) => void;
  deleteSeedCatalogItem: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface DataProviderProps {
  children: ReactNode;
  actor?: backendInterface | null;
}

export function DataProvider({ children, actor }: DataProviderProps) {
  const [data, setData] = useState<AppData>(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data from backend on mount / when actor becomes available
  useEffect(() => {
    if (!actor) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    Promise.all([
      actor.getAllCustomers(),
      actor.getAllSuppliers(),
      actor.getAllStockItems(),
      actor.getAllBills(),
      actor.getAllSeedCatalog(),
    ])
      .then(([customers, suppliers, stock, bills, seedCatalog]) => {
        setData({
          customers: customers.map(customerFromBackend),
          suppliers: suppliers.map(supplierFromBackend),
          stock: stock.map(stockItemFromBackend),
          bills: bills.map(billFromBackend),
          seedCatalog: seedCatalog.map(seedCatalogFromBackend),
        });
      })
      .catch((err) => {
        console.error("Failed to load initial data", err);
        toast.error("Failed to load data from server");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [actor]);

  // ---------------------------------------------------------------------------
  // Refresh helpers
  // ---------------------------------------------------------------------------

  const refreshCustomers = async () => {
    if (!actor) return;
    try {
      const customers = await actor.getAllCustomers();
      setData((prev) => ({
        ...prev,
        customers: customers.map(customerFromBackend),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshSuppliers = async () => {
    if (!actor) return;
    try {
      const suppliers = await actor.getAllSuppliers();
      setData((prev) => ({
        ...prev,
        suppliers: suppliers.map(supplierFromBackend),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshStock = async () => {
    if (!actor) return;
    try {
      const stock = await actor.getAllStockItems();
      setData((prev) => ({ ...prev, stock: stock.map(stockItemFromBackend) }));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshBills = async () => {
    if (!actor) return;
    try {
      const bills = await actor.getAllBills();
      setData((prev) => ({ ...prev, bills: bills.map(billFromBackend) }));
    } catch (err) {
      console.error(err);
    }
  };

  const refreshSeedCatalog = async () => {
    if (!actor) return;
    try {
      const seedCatalog = await actor.getAllSeedCatalog();
      setData((prev) => ({
        ...prev,
        seedCatalog: seedCatalog.map(seedCatalogFromBackend),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------------------------------------------
  // Customer mutations
  // ---------------------------------------------------------------------------

  const addCustomer = async (c: Omit<Customer, "id" | "transactions">) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        customers: [
          ...prev.customers,
          { ...c, id: Math.random().toString(36).slice(2), transactions: [] },
        ],
      }));
      return;
    }
    try {
      await actor.createCustomer(c.name, c.address, c.phone, c.notes || "");
      await refreshCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add customer");
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        customers: prev.customers.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      }));
      return;
    }
    // Find current customer to fill in unchanged fields
    const current = data.customers.find((c) => c.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };
    try {
      await actor.updateCustomer(
        BigInt(id),
        merged.name,
        merged.address,
        merged.phone,
        merged.notes || "",
      );
      await refreshCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update customer");
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        customers: prev.customers.filter((c) => c.id !== id),
      }));
      return;
    }
    try {
      await actor.deleteCustomer(BigInt(id));
      await refreshCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete customer");
    }
  };

  const addCustomerTransaction = async (
    customerId: string,
    tx: Omit<Transaction, "id">,
  ) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        customers: prev.customers.map((c) =>
          c.id === customerId
            ? {
                ...c,
                transactions: [
                  ...c.transactions,
                  { ...tx, id: Math.random().toString(36).slice(2) },
                ],
              }
            : c,
        ),
      }));
      return;
    }
    try {
      await actor.addCustomerTransaction(
        BigInt(customerId),
        tx.date,
        tx.amountPaid,
        tx.amountDue,
        tx.unitRate,
        tx.quantity,
        unitToBackend(tx.unit),
        tx.seedType,
        tx.dueDate || "",
        tx.paymentDate || "",
        tx.notes || "",
      );
      await refreshCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction");
    }
  };

  // ---------------------------------------------------------------------------
  // Supplier mutations
  // ---------------------------------------------------------------------------

  const addSupplier = async (s: Omit<Supplier, "id" | "transactions">) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        suppliers: [
          ...prev.suppliers,
          { ...s, id: Math.random().toString(36).slice(2), transactions: [] },
        ],
      }));
      return;
    }
    try {
      await actor.createSupplier(s.name, s.address, s.phone, s.notes || "");
      await refreshSuppliers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add supplier");
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        suppliers: prev.suppliers.map((s) =>
          s.id === id ? { ...s, ...updates } : s,
        ),
      }));
      return;
    }
    const current = data.suppliers.find((s) => s.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };
    try {
      await actor.updateSupplier(
        BigInt(id),
        merged.name,
        merged.address,
        merged.phone,
        merged.notes || "",
      );
      await refreshSuppliers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update supplier");
    }
  };

  const deleteSupplier = async (id: string) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        suppliers: prev.suppliers.filter((s) => s.id !== id),
      }));
      return;
    }
    try {
      await actor.deleteSupplier(BigInt(id));
      await refreshSuppliers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete supplier");
    }
  };

  const addSupplierTransaction = async (
    supplierId: string,
    tx: Omit<Transaction, "id">,
  ) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        suppliers: prev.suppliers.map((s) =>
          s.id === supplierId
            ? {
                ...s,
                transactions: [
                  ...s.transactions,
                  { ...tx, id: Math.random().toString(36).slice(2) },
                ],
              }
            : s,
        ),
      }));
      return;
    }
    try {
      await actor.addSupplierTransaction(
        BigInt(supplierId),
        tx.date,
        tx.amountPaid,
        tx.amountDue,
        tx.unitRate,
        tx.quantity,
        unitToBackend(tx.unit),
        tx.seedType,
        tx.dueDate || "",
        tx.paymentDate || "",
        tx.notes || "",
      );
      await refreshSuppliers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction");
    }
  };

  // ---------------------------------------------------------------------------
  // Stock mutations
  // ---------------------------------------------------------------------------

  const addStockItem = async (item: Omit<StockItem, "id">) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        stock: [
          ...prev.stock,
          { ...item, id: Math.random().toString(36).slice(2) },
        ],
      }));
      return;
    }
    try {
      await actor.createStockItem(
        item.name,
        item.category,
        item.bags,
        item.packets,
        item.kg,
        item.grams,
        item.costPrice,
        item.sellPrice,
        item.imageUrl || "",
        item.description || "",
        item.reorderLevel,
      );
      await refreshStock();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add stock item");
    }
  };

  const updateStockItem = async (id: string, updates: Partial<StockItem>) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        stock: prev.stock.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }));
      return;
    }
    const current = data.stock.find((s) => s.id === id);
    if (!current) return;
    const merged = { ...current, ...updates };
    try {
      await actor.updateStockItem(
        BigInt(id),
        merged.name,
        merged.category,
        merged.bags,
        merged.packets,
        merged.kg,
        merged.grams,
        merged.costPrice,
        merged.sellPrice,
        merged.imageUrl || "",
        merged.description || "",
        merged.reorderLevel,
      );
      await refreshStock();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stock item");
    }
  };

  const deleteStockItem = async (id: string) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        stock: prev.stock.filter((s) => s.id !== id),
      }));
      return;
    }
    try {
      await actor.deleteStockItem(BigInt(id));
      await refreshStock();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete stock item");
    }
  };

  // ---------------------------------------------------------------------------
  // Bill mutations
  // ---------------------------------------------------------------------------

  const addBill = async (bill: Omit<Bill, "id" | "billNumber">) => {
    if (!actor) {
      const id = Math.random().toString(36).slice(2);
      const billNumber = `LBB-${String(data.bills.length + 1).padStart(4, "0")}`;
      setData((prev) => ({
        ...prev,
        bills: [...prev.bills, { ...bill, id, billNumber }],
      }));
      return;
    }
    try {
      const backendLineItems: BackendBillLineItem[] = bill.lineItems.map(
        (li) => ({
          productName: li.productName,
          quantity: li.quantity,
          unit: unitToBackend(li.unit),
          unitRate: li.unitRate,
          amount: li.amount,
        }),
      );
      const created = await actor.createBill(
        BigInt(bill.customerId) || BigInt(0),
        bill.customerName,
        bill.customerAddress,
        bill.customerPhone,
        bill.purchaseDate,
        bill.dueDate || "",
        bill.paymentDate || "",
        backendLineItems,
        bill.totalAmount,
        bill.discount,
        bill.tax,
        bill.finalAmount,
        statusToBackend(bill.status),
      );
      await refreshBills();
      // Return bill number for caller reference
      return `LBB-${String(created.id).padStart(4, "0")}`;
    } catch (err) {
      console.error(err);
      toast.error("Failed to create bill");
    }
  };

  const updateBillStatus = async (id: string, status: Bill["status"]) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        bills: prev.bills.map((b) => (b.id === id ? { ...b, status } : b)),
      }));
      return;
    }
    const current = data.bills.find((b) => b.id === id);
    try {
      await actor.updateBillStatus(
        BigInt(id),
        statusToBackend(status),
        current?.paymentDate || "",
      );
      await refreshBills();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bill status");
    }
  };

  const updateBill = async (id: string, updates: Partial<Bill>) => {
    // No direct updateBill on backend — update local state only
    // (billing edits beyond status require re-creation, which pages don't do)
    setData((prev) => ({
      ...prev,
      bills: prev.bills.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  };

  const deleteBill = async (id: string) => {
    // No deleteBill on backend interface — manage locally
    setData((prev) => ({
      ...prev,
      bills: prev.bills.filter((b) => b.id !== id),
    }));
  };

  // ---------------------------------------------------------------------------
  // Seed catalog mutations
  // ---------------------------------------------------------------------------

  const addSeedCatalogItem = async (item: Omit<SeedCatalogItem, "id">) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        seedCatalog: [
          ...prev.seedCatalog,
          { ...item, id: Math.random().toString(36).slice(2) },
        ],
      }));
      return;
    }
    try {
      await actor.addSeedCatalog(
        item.name,
        item.category,
        item.description,
        item.season,
        item.region,
      );
      await refreshSeedCatalog();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add seed catalog item");
    }
  };

  const deleteSeedCatalogItem = async (id: string) => {
    if (!actor) {
      setData((prev) => ({
        ...prev,
        seedCatalog: prev.seedCatalog.filter((s) => s.id !== id),
      }));
      return;
    }
    try {
      await actor.deleteSeedCatalog(BigInt(id));
      await refreshSeedCatalog();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete seed catalog item");
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        isLoading,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addCustomerTransaction,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addSupplierTransaction,
        addStockItem,
        updateStockItem,
        deleteStockItem,
        addBill,
        updateBillStatus,
        updateBill,
        deleteBill,
        addSeedCatalogItem,
        deleteSeedCatalogItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}

export type { BillLineItem };
