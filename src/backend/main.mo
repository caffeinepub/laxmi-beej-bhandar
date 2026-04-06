import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";

actor LaxmiBeejBhandar {

  // ===================== TYPES =====================

  public type UnitType = { #Bags; #Packets; #Kg; #Grams };
  public type PaymentStatus = { #Paid; #Unpaid; #Partial };
  public type UserRole = { #Admin; #Staff };

  public type UserProfile = {
    id: Nat;
    firstName: Text;
    lastName: Text;
    phone: Text;
    storeName: Text;
    passwordHash: Text;
    profilePhotoUrl: Text;
    role: UserRole;
  };

  public type Transaction = {
    id: Nat;
    purchaseDate: Text;
    amountPaid: Float;
    amountDue: Float;
    unitRate: Float;
    quantity: Float;
    unit: UnitType;
    seedType: Text;
    dueDate: Text;
    paymentDate: Text;
    notes: Text;
  };

  public type Customer = {
    id: Nat;
    name: Text;
    address: Text;
    phone: Text;
    notes: Text;
    transactions: [Transaction];
  };

  public type Supplier = {
    id: Nat;
    name: Text;
    address: Text;
    phone: Text;
    notes: Text;
    transactions: [Transaction];
  };

  public type StockItem = {
    id: Nat;
    productName: Text;
    seedCategory: Text;
    quantityBags: Float;
    quantityPackets: Float;
    quantityKg: Float;
    quantityGrams: Float;
    costPrice: Float;
    sellPrice: Float;
    imageUrl: Text;
    description: Text;
    reorderLevel: Float;
  };

  public type BillLineItem = {
    productName: Text;
    quantity: Float;
    unit: UnitType;
    unitRate: Float;
    amount: Float;
  };

  public type Bill = {
    id: Nat;
    customerId: Nat;
    customerName: Text;
    address: Text;
    phone: Text;
    purchaseDate: Text;
    dueDate: Text;
    paymentDate: Text;
    lineItems: [BillLineItem];
    totalAmount: Float;
    discount: Float;
    tax: Float;
    finalAmount: Float;
    status: PaymentStatus;
  };

  public type MonthlySales = {
    id: Nat;
    year: Nat;
    month: Nat;
    totalSales: Float;
    totalPurchases: Float;
    profit: Float;
  };

  public type SeedCatalog = {
    id: Nat;
    name: Text;
    category: Text;
    description: Text;
    season: Text;
    region: Text;
  };

  // ===================== STABLE STATE =====================

  stable var nextUserId: Nat = 1;
  stable var nextCustomerId: Nat = 1;
  stable var nextSupplierId: Nat = 1;
  stable var nextStockId: Nat = 1;
  stable var nextBillId: Nat = 1;
  stable var nextMonthlySalesId: Nat = 1;
  stable var nextSeedCatalogId: Nat = 1;
  stable var nextTransactionId: Nat = 1;

  stable var usersStore: [UserProfile] = [];
  stable var customersStore: [Customer] = [];
  stable var suppliersStore: [Supplier] = [];
  stable var stockItemsStore: [StockItem] = [];
  stable var billsStore: [Bill] = [];
  stable var monthlySalesStore: [MonthlySales] = [];
  stable var seedCatalogStore: [SeedCatalog] = [
    { id = 1;  name = "Maize";       category = "Cereal";    description = "Kharif staple crop used for food and fodder";      season = "Kharif";      region = "India" },
    { id = 2;  name = "Paddy";       category = "Cereal";    description = "Main rice crop grown across India";               season = "Kharif";      region = "India" },
    { id = 3;  name = "Wheat";       category = "Cereal";    description = "Major rabi cereal crop of India";                 season = "Rabi";        region = "India" },
    { id = 4;  name = "Rice";        category = "Cereal";    description = "Staple food grain grown in wet conditions";       season = "Kharif";      region = "India" },
    { id = 5;  name = "Mustard";     category = "Oilseed";   description = "Important oilseed crop for cooking oil";          season = "Rabi";        region = "India" },
    { id = 6;  name = "Sunflower";   category = "Oilseed";   description = "Oilseed crop with high oil content";               season = "Kharif/Rabi"; region = "India" },
    { id = 7;  name = "Soybean";     category = "Oilseed";   description = "Protein-rich oilseed crop";                       season = "Kharif";      region = "India" },
    { id = 8;  name = "Tomato";      category = "Vegetable"; description = "Popular vegetable crop grown year-round";         season = "All seasons"; region = "India" },
    { id = 9;  name = "Onion";       category = "Vegetable"; description = "Essential kitchen vegetable with strong demand";  season = "Rabi";        region = "India" },
    { id = 10; name = "Potato";      category = "Vegetable"; description = "Widely consumed tuber vegetable";                 season = "Rabi";        region = "India" },
    { id = 11; name = "Chilli";      category = "Vegetable"; description = "Spice and vegetable crop for hot climate";        season = "Kharif";      region = "India" },
    { id = 12; name = "Brinjal";     category = "Vegetable"; description = "Tropical vegetable crop also called eggplant";   season = "Kharif";      region = "India" },
    { id = 13; name = "Cauliflower"; category = "Vegetable"; description = "Cool season brassica vegetable";                  season = "Rabi";        region = "India" },
    { id = 14; name = "Cabbage";     category = "Vegetable"; description = "Cool season leafy vegetable";                     season = "Rabi";        region = "India" },
    { id = 15; name = "Okra";        category = "Vegetable"; description = "Warm season vegetable also called bhindi";        season = "Kharif";      region = "India" },
    { id = 16; name = "Pumpkin";     category = "Vegetable"; description = "Large fruited vegetable with high yield";         season = "Kharif";      region = "India" },
    { id = 17; name = "Cucumber";    category = "Vegetable"; description = "Vine vegetable grown in warm conditions";         season = "Kharif";      region = "India" },
    { id = 18; name = "Moong";       category = "Pulse";     description = "Short duration pulse crop with high nutrition";  season = "Kharif";      region = "India" },
    { id = 19; name = "Urad";        category = "Pulse";     description = "Black gram pulse crop widely used in India";     season = "Kharif";      region = "India" },
    { id = 20; name = "Chana";       category = "Pulse";     description = "Chickpea pulse crop of high protein value";      season = "Rabi";        region = "India" }
  ];

  // Track that seed catalog IDs are initialized past pre-populated entries
  stable var seedCatalogInitialized: Bool = false;

  // ===================== INIT =====================

  // Ensure nextSeedCatalogId starts after pre-populated seeds
  private func ensureInit() {
    if (not seedCatalogInitialized) {
      nextSeedCatalogId := 21;
      seedCatalogInitialized := true;
    };
  };

  ensureInit();

  // ===================== USER MANAGEMENT =====================

  public func createUser(firstName: Text, lastName: Text, phone: Text, storeName: Text, passwordHash: Text) : async ?UserProfile {
    for (u in usersStore.vals()) {
      if (u.phone == phone) return null;
    };
    let id = nextUserId;
    nextUserId += 1;
    let user : UserProfile = { id; firstName; lastName; phone; storeName; passwordHash; profilePhotoUrl = ""; role = #Admin };
    usersStore := Array.append(usersStore, [user]);
    ?user
  };

  public query func getUserByPhone(phone: Text) : async ?UserProfile {
    for (u in usersStore.vals()) {
      if (u.phone == phone) return ?u;
    };
    null
  };

  public func updateUserProfile(id: Nat, firstName: Text, lastName: Text, storeName: Text) : async Bool {
    var found = false;
    usersStore := Array.map<UserProfile, UserProfile>(usersStore, func(u) {
      if (u.id == id) { found := true; { u with firstName; lastName; storeName } } else u
    });
    found
  };

  public func updateUserPassword(id: Nat, newPasswordHash: Text) : async Bool {
    var found = false;
    usersStore := Array.map<UserProfile, UserProfile>(usersStore, func(u) {
      if (u.id == id) { found := true; { u with passwordHash = newPasswordHash } } else u
    });
    found
  };

  public func updateUserPhoto(id: Nat, photoUrl: Text) : async Bool {
    var found = false;
    usersStore := Array.map<UserProfile, UserProfile>(usersStore, func(u) {
      if (u.id == id) { found := true; { u with profilePhotoUrl = photoUrl } } else u
    });
    found
  };

  public query func getAllUsers() : async [UserProfile] { usersStore };

  // ===================== CUSTOMER MANAGEMENT =====================

  public func createCustomer(name: Text, address: Text, phone: Text, notes: Text) : async Customer {
    let id = nextCustomerId;
    nextCustomerId += 1;
    let customer : Customer = { id; name; address; phone; notes; transactions = [] };
    customersStore := Array.append(customersStore, [customer]);
    customer
  };

  public query func getAllCustomers() : async [Customer] { customersStore };

  public query func getCustomer(id: Nat) : async ?Customer {
    for (c in customersStore.vals()) {
      if (c.id == id) return ?c;
    };
    null
  };

  public func updateCustomer(id: Nat, name: Text, address: Text, phone: Text, notes: Text) : async Bool {
    var found = false;
    customersStore := Array.map<Customer, Customer>(customersStore, func(c) {
      if (c.id == id) { found := true; { c with name; address; phone; notes } } else c
    });
    found
  };

  public func deleteCustomer(id: Nat) : async Bool {
    let before = customersStore.size();
    customersStore := Array.filter<Customer>(customersStore, func(c) { c.id != id });
    customersStore.size() < before
  };

  public func addCustomerTransaction(customerId: Nat, purchaseDate: Text, amountPaid: Float,
    amountDue: Float, unitRate: Float, quantity: Float, unit: UnitType, seedType: Text,
    dueDate: Text, paymentDate: Text, notes: Text) : async Bool {
    var found = false;
    let txId = nextTransactionId;
    nextTransactionId += 1;
    let tx : Transaction = { id = txId; purchaseDate; amountPaid; amountDue; unitRate; quantity; unit; seedType; dueDate; paymentDate; notes };
    customersStore := Array.map<Customer, Customer>(customersStore, func(c) {
      if (c.id == customerId) {
        found := true;
        { c with transactions = Array.append(c.transactions, [tx]) }
      } else c
    });
    found
  };

  public query func getCustomerAnnualTotal(customerId: Nat, year: Text) : async Float {
    for (c in customersStore.vals()) {
      if (c.id == customerId) {
        var total : Float = 0.0;
        for (tx in c.transactions.vals()) {
          if (Text.startsWith(tx.purchaseDate, #text year)) {
            total += tx.amountPaid;
          };
        };
        return total;
      };
    };
    0.0
  };

  // ===================== SUPPLIER MANAGEMENT =====================

  public func createSupplier(name: Text, address: Text, phone: Text, notes: Text) : async Supplier {
    let id = nextSupplierId;
    nextSupplierId += 1;
    let supplier : Supplier = { id; name; address; phone; notes; transactions = [] };
    suppliersStore := Array.append(suppliersStore, [supplier]);
    supplier
  };

  public query func getAllSuppliers() : async [Supplier] { suppliersStore };

  public query func getSupplier(id: Nat) : async ?Supplier {
    for (s in suppliersStore.vals()) {
      if (s.id == id) return ?s;
    };
    null
  };

  public func updateSupplier(id: Nat, name: Text, address: Text, phone: Text, notes: Text) : async Bool {
    var found = false;
    suppliersStore := Array.map<Supplier, Supplier>(suppliersStore, func(s) {
      if (s.id == id) { found := true; { s with name; address; phone; notes } } else s
    });
    found
  };

  public func deleteSupplier(id: Nat) : async Bool {
    let before = suppliersStore.size();
    suppliersStore := Array.filter<Supplier>(suppliersStore, func(s) { s.id != id });
    suppliersStore.size() < before
  };

  public func addSupplierTransaction(supplierId: Nat, purchaseDate: Text, amountPaid: Float,
    amountDue: Float, unitRate: Float, quantity: Float, unit: UnitType, seedType: Text,
    dueDate: Text, paymentDate: Text, notes: Text) : async Bool {
    var found = false;
    let txId = nextTransactionId;
    nextTransactionId += 1;
    let tx : Transaction = { id = txId; purchaseDate; amountPaid; amountDue; unitRate; quantity; unit; seedType; dueDate; paymentDate; notes };
    suppliersStore := Array.map<Supplier, Supplier>(suppliersStore, func(s) {
      if (s.id == supplierId) {
        found := true;
        { s with transactions = Array.append(s.transactions, [tx]) }
      } else s
    });
    found
  };

  // ===================== STOCK MANAGEMENT =====================

  public func createStockItem(productName: Text, seedCategory: Text, quantityBags: Float,
    quantityPackets: Float, quantityKg: Float, quantityGrams: Float, costPrice: Float,
    sellPrice: Float, imageUrl: Text, description: Text, reorderLevel: Float) : async StockItem {
    let id = nextStockId;
    nextStockId += 1;
    let item : StockItem = { id; productName; seedCategory; quantityBags; quantityPackets; quantityKg; quantityGrams; costPrice; sellPrice; imageUrl; description; reorderLevel };
    stockItemsStore := Array.append(stockItemsStore, [item]);
    item
  };

  public query func getAllStockItems() : async [StockItem] { stockItemsStore };

  public query func getStockItem(id: Nat) : async ?StockItem {
    for (item in stockItemsStore.vals()) {
      if (item.id == id) return ?item;
    };
    null
  };

  public func updateStockItem(id: Nat, productName: Text, seedCategory: Text, quantityBags: Float,
    quantityPackets: Float, quantityKg: Float, quantityGrams: Float, costPrice: Float,
    sellPrice: Float, imageUrl: Text, description: Text, reorderLevel: Float) : async Bool {
    var found = false;
    stockItemsStore := Array.map<StockItem, StockItem>(stockItemsStore, func(item) {
      if (item.id == id) {
        found := true;
        { id; productName; seedCategory; quantityBags; quantityPackets; quantityKg; quantityGrams; costPrice; sellPrice; imageUrl; description; reorderLevel }
      } else item
    });
    found
  };

  public func deleteStockItem(id: Nat) : async Bool {
    let before = stockItemsStore.size();
    stockItemsStore := Array.filter<StockItem>(stockItemsStore, func(item) { item.id != id });
    stockItemsStore.size() < before
  };

  // ===================== BILLING =====================

  public func createBill(customerId: Nat, customerName: Text, address: Text, phone: Text,
    purchaseDate: Text, dueDate: Text, paymentDate: Text, lineItems: [BillLineItem],
    totalAmount: Float, discount: Float, tax: Float, finalAmount: Float, status: PaymentStatus) : async Bill {
    let id = nextBillId;
    nextBillId += 1;
    let bill : Bill = { id; customerId; customerName; address; phone; purchaseDate; dueDate; paymentDate; lineItems; totalAmount; discount; tax; finalAmount; status };
    billsStore := Array.append(billsStore, [bill]);
    bill
  };

  public query func getAllBills() : async [Bill] { billsStore };

  public query func getBillsByCustomer(customerId: Nat) : async [Bill] {
    Array.filter<Bill>(billsStore, func(b) { b.customerId == customerId })
  };

  public func updateBillStatus(id: Nat, status: PaymentStatus, paymentDate: Text) : async Bool {
    var found = false;
    billsStore := Array.map<Bill, Bill>(billsStore, func(b) {
      if (b.id == id) { found := true; { b with status; paymentDate } } else b
    });
    found
  };

  // ===================== ANALYTICS =====================

  public func upsertMonthlySales(year: Nat, month: Nat, totalSales: Float, totalPurchases: Float) : async MonthlySales {
    var existing : ?MonthlySales = null;
    for (ms in monthlySalesStore.vals()) {
      if (ms.year == year and ms.month == month) { existing := ?ms; };
    };
    switch (existing) {
      case (?ms) {
        let profit = totalSales - totalPurchases;
        let updated : MonthlySales = { ms with totalSales; totalPurchases; profit };
        monthlySalesStore := Array.map<MonthlySales, MonthlySales>(monthlySalesStore, func(r) {
          if (r.id == ms.id) updated else r
        });
        updated
      };
      case null {
        let id = nextMonthlySalesId;
        nextMonthlySalesId += 1;
        let profit = totalSales - totalPurchases;
        let ms : MonthlySales = { id; year; month; totalSales; totalPurchases; profit };
        monthlySalesStore := Array.append(monthlySalesStore, [ms]);
        ms
      };
    }
  };

  public query func getMonthlySalesByYear(year: Nat) : async [MonthlySales] {
    Array.filter<MonthlySales>(monthlySalesStore, func(ms) { ms.year == year })
  };

  public query func getAllMonthlySales() : async [MonthlySales] { monthlySalesStore };

  public query func getAnnualSummary(year: Text) : async (Float, Float, Float) {
    var totalSales : Float = 0.0;
    for (c in customersStore.vals()) {
      for (tx in c.transactions.vals()) {
        if (Text.startsWith(tx.purchaseDate, #text year)) {
          totalSales += tx.amountPaid;
        };
      };
    };
    var totalCost : Float = 0.0;
    for (s in suppliersStore.vals()) {
      for (tx in s.transactions.vals()) {
        if (Text.startsWith(tx.purchaseDate, #text year)) {
          totalCost += tx.amountPaid;
        };
      };
    };
    let profit = totalSales - totalCost;
    (totalSales, totalCost, profit)
  };

  // ===================== SEED CATALOG =====================

  public query func getAllSeedCatalog() : async [SeedCatalog] { seedCatalogStore };

  public func addSeedCatalog(name: Text, category: Text, description: Text, season: Text, region: Text) : async SeedCatalog {
    let id = nextSeedCatalogId;
    nextSeedCatalogId += 1;
    let entry : SeedCatalog = { id; name; category; description; season; region };
    seedCatalogStore := Array.append(seedCatalogStore, [entry]);
    entry
  };

  public func deleteSeedCatalog(id: Nat) : async Bool {
    let before = seedCatalogStore.size();
    seedCatalogStore := Array.filter<SeedCatalog>(seedCatalogStore, func(e) { e.id != id });
    seedCatalogStore.size() < before
  };
};
