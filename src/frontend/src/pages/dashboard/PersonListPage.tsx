import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Receipt, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import type { Customer, Transaction, UnitType } from "../../types";

const GREEN = "oklch(0.22 0.06 148)";
const TERRA = "oklch(0.52 0.15 33)";
const GOLD = "oklch(0.72 0.13 80)";

const UNITS: UnitType[] = ["Bags", "Packets", "Kg", "Grams"];

function fmt(n: number) {
  return `\u20b9${n.toLocaleString("en-IN")}`;
}

function CustomerDetail({
  customer,
  onBack,
  isSupplier = false,
}: {
  customer: Customer;
  onBack: () => void;
  isSupplier?: boolean;
}) {
  const { addCustomerTransaction, addSupplierTransaction } = useData();
  const [txOpen, setTxOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [txForm, setTxForm] = useState<Omit<Transaction, "id">>({
    date: "",
    seedType: "",
    quantity: 0,
    unit: "Bags",
    unitRate: 0,
    amountPaid: 0,
    amountDue: 0,
    dueDate: "",
    paymentDate: "",
    notes: "",
  });

  const annualTotals = useMemo(() => {
    const map: Record<string, { paid: number; due: number; count: number }> =
      {};
    for (const tx of customer.transactions) {
      const year = tx.date.slice(0, 4) || "Unknown";
      if (!map[year]) map[year] = { paid: 0, due: 0, count: 0 };
      map[year].paid += tx.amountPaid;
      map[year].due += tx.amountDue;
      map[year].count++;
    }
    return map;
  }, [customer.transactions]);

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.date || !txForm.seedType) {
      toast.error("Date and seed type are required");
      return;
    }
    if (isSupplier) {
      addSupplierTransaction(customer.id, txForm);
    } else {
      addCustomerTransaction(customer.id, txForm);
    }
    toast.success("Transaction added!");
    setTxOpen(false);
    setTxForm({
      date: "",
      seedType: "",
      quantity: 0,
      unit: "Bags",
      unitRate: 0,
      amountPaid: 0,
      amountDue: 0,
      dueDate: "",
      paymentDate: "",
      notes: "",
    });
  };

  const totalPaid = customer.transactions.reduce((a, t) => a + t.amountPaid, 0);
  const totalDue = customer.transactions.reduce((a, t) => a + t.amountDue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="detail.back.button"
          style={{ color: GREEN }}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h2 className="font-display font-bold text-xl" style={{ color: GREEN }}>
          {customer.name}
        </h2>
      </div>

      {/* Info Card */}
      <div
        className="bg-white rounded-xl p-5 shadow-card grid md:grid-cols-3 gap-4"
        style={{ border: "1px solid oklch(0.88 0.04 85)" }}
      >
        <div>
          <p className="text-xs text-muted-foreground">Phone</p>
          <p className="font-medium text-sm mt-0.5">{customer.phone}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Address</p>
          <p className="font-medium text-sm mt-0.5">{customer.address}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Notes</p>
          <p className="text-sm mt-0.5 text-muted-foreground">
            {customer.notes || "-"}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-white rounded-xl p-4 shadow-card"
          style={{ border: "2px solid oklch(0.88 0.04 85)" }}
        >
          <p className="text-xs text-muted-foreground">Total Paid</p>
          <p
            className="text-2xl font-bold font-display mt-0.5"
            style={{ color: GREEN }}
          >
            {fmt(totalPaid)}
          </p>
        </div>
        <div
          className="bg-white rounded-xl p-4 shadow-card"
          style={{ border: "2px solid oklch(0.88 0.04 85)" }}
        >
          <p className="text-xs text-muted-foreground">Total Due</p>
          <p
            className="text-2xl font-bold font-display mt-0.5"
            style={{
              color: totalDue > 0 ? TERRA : "oklch(0.45 0.1 148)",
            }}
          >
            {fmt(totalDue)}
          </p>
        </div>
      </div>

      {/* Annual Totals */}
      {Object.keys(annualTotals).length > 0 && (
        <div
          className="bg-white rounded-xl p-5 shadow-card"
          style={{ border: "1px solid oklch(0.88 0.04 85)" }}
        >
          <h3
            className="font-display font-semibold text-base mb-3"
            style={{ color: GREEN }}
          >
            Annual Purchase Totals
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(annualTotals).map(([year, totals]) => (
              <div
                key={year}
                className="rounded-lg p-3 text-center"
                style={{ background: "oklch(0.94 0.035 85)" }}
              >
                <p className="text-xs text-muted-foreground">{year}</p>
                <p
                  className="font-bold text-sm font-display"
                  style={{ color: GREEN }}
                >
                  {fmt(totals.paid)}
                </p>
                <p className="text-xs" style={{ color: TERRA }}>
                  {totals.count} transactions
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions */}
      <div
        className="bg-white rounded-xl shadow-card overflow-hidden"
        style={{ border: "1px solid oklch(0.88 0.04 85)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: "oklch(0.93 0.02 85)" }}
        >
          <h3
            className="font-display font-semibold text-sm"
            style={{ color: GREEN }}
          >
            Transactions
          </h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBillOpen(true)}
              data-ocid="detail.generate_bill.button"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              <Receipt className="w-3.5 h-3.5 mr-1" /> Bill
            </Button>
            <Dialog open={txOpen} onOpenChange={setTxOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  data-ocid="detail.add_transaction.button"
                  style={{ background: GREEN, color: "white" }}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-lg max-h-[90vh] overflow-y-auto"
                data-ocid="detail.transaction.dialog"
              >
                <DialogHeader>
                  <DialogTitle
                    className="font-display"
                    style={{ color: GREEN }}
                  >
                    Add Transaction
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleTxSubmit} className="space-y-3 mt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={txForm.date}
                        onChange={(e) =>
                          setTxForm((p) => ({ ...p, date: e.target.value }))
                        }
                        data-ocid="transaction.date.input"
                      />
                    </div>
                    <div>
                      <Label>Seed Type *</Label>
                      <Input
                        placeholder="e.g. Paddy MRC-7017"
                        value={txForm.seedType}
                        onChange={(e) =>
                          setTxForm((p) => ({ ...p, seedType: e.target.value }))
                        }
                        data-ocid="transaction.seed.input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min={0}
                        value={txForm.quantity}
                        onChange={(e) =>
                          setTxForm((p) => ({
                            ...p,
                            quantity: Number(e.target.value),
                          }))
                        }
                        data-ocid="transaction.quantity.input"
                      />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Select
                        value={txForm.unit}
                        onValueChange={(v) =>
                          setTxForm((p) => ({ ...p, unit: v as UnitType }))
                        }
                      >
                        <SelectTrigger data-ocid="transaction.unit.select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNITS.map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Unit Rate (\u20b9)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={txForm.unitRate}
                        onChange={(e) =>
                          setTxForm((p) => ({
                            ...p,
                            unitRate: Number(e.target.value),
                          }))
                        }
                        data-ocid="transaction.rate.input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Amount Paid (\u20b9)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={txForm.amountPaid}
                        onChange={(e) =>
                          setTxForm((p) => ({
                            ...p,
                            amountPaid: Number(e.target.value),
                          }))
                        }
                        data-ocid="transaction.paid.input"
                      />
                    </div>
                    <div>
                      <Label>Amount Due (\u20b9)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={txForm.amountDue}
                        onChange={(e) =>
                          setTxForm((p) => ({
                            ...p,
                            amountDue: Number(e.target.value),
                          }))
                        }
                        data-ocid="transaction.due.input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={txForm.dueDate}
                        onChange={(e) =>
                          setTxForm((p) => ({ ...p, dueDate: e.target.value }))
                        }
                        data-ocid="transaction.due_date.input"
                      />
                    </div>
                    <div>
                      <Label>Payment Date</Label>
                      <Input
                        type="date"
                        value={txForm.paymentDate}
                        onChange={(e) =>
                          setTxForm((p) => ({
                            ...p,
                            paymentDate: e.target.value,
                          }))
                        }
                        data-ocid="transaction.payment_date.input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={txForm.notes}
                      onChange={(e) =>
                        setTxForm((p) => ({ ...p, notes: e.target.value }))
                      }
                      data-ocid="transaction.notes.textarea"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      data-ocid="transaction.submit_button"
                      style={{ background: GREEN, color: "white" }}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setTxOpen(false)}
                      data-ocid="transaction.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="overflow-x-auto">
          {customer.transactions.length === 0 ? (
            <div
              data-ocid="transactions.empty_state"
              className="text-center py-10 text-muted-foreground text-sm"
            >
              No transactions yet. Add one to get started.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "oklch(0.94 0.035 85)" }}>
                  {[
                    "Date",
                    "Seed Type",
                    "Qty",
                    "Unit",
                    "Rate",
                    "Paid",
                    "Due",
                    "Due Date",
                    "Pay Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left font-semibold"
                      style={{ color: "oklch(0.45 0.03 148)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customer.transactions.map((tx, i) => (
                  <tr
                    key={tx.id}
                    data-ocid={`transactions.item.${i + 1}`}
                    className="border-b last:border-0"
                    style={{ borderColor: "oklch(0.93 0.02 85)" }}
                  >
                    <td className="px-3 py-2">{tx.date}</td>
                    <td className="px-3 py-2 font-medium">{tx.seedType}</td>
                    <td className="px-3 py-2">{tx.quantity}</td>
                    <td className="px-3 py-2">{tx.unit}</td>
                    <td className="px-3 py-2">{fmt(tx.unitRate)}</td>
                    <td
                      className="px-3 py-2 font-semibold"
                      style={{ color: GREEN }}
                    >
                      {fmt(tx.amountPaid)}
                    </td>
                    <td
                      className="px-3 py-2"
                      style={{
                        color: tx.amountDue > 0 ? TERRA : "inherit",
                      }}
                    >
                      {fmt(tx.amountDue)}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {tx.dueDate || "-"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {tx.paymentDate || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bill Dialog */}
      <Dialog open={billOpen} onOpenChange={setBillOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none"
          data-ocid="bill.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display" style={{ color: GREEN }}>
              Bill - {customer.name}
            </DialogTitle>
          </DialogHeader>
          <div className="print-bill mt-4">
            <div
              className="text-center border-b pb-4 mb-4"
              style={{ borderColor: "oklch(0.88 0.04 85)" }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src="/assets/generated/lbb-logo-transparent.dim_120x120.png"
                  alt="LBB"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <h2
                  className="font-display font-bold text-xl"
                  style={{ color: GREEN }}
                >
                  Laxmi Beej Bhandar
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Main Market, Krishi Nagar, Lucknow | +91 98765 43210
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="font-semibold text-xs text-muted-foreground mb-1">
                  Bill To:
                </p>
                <p className="font-bold">{customer.name}</p>
                <p className="text-muted-foreground text-xs">
                  {customer.address}
                </p>
                <p className="text-xs">{customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Bill Date:{" "}
                  <span className="font-medium text-foreground">
                    {new Date().toLocaleDateString("en-IN")}
                  </span>
                </p>
              </div>
            </div>
            <table className="w-full text-xs mb-4">
              <thead>
                <tr style={{ background: GREEN }}>
                  {["Date", "Seed", "Qty", "Unit", "Rate", "Paid", "Due"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left"
                        style={{ color: "white" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {customer.transactions.map((tx, i) => (
                  <tr
                    key={tx.id}
                    style={{
                      background: i % 2 === 0 ? "white" : "oklch(0.96 0.02 85)",
                    }}
                  >
                    <td className="px-3 py-1.5">{tx.date}</td>
                    <td className="px-3 py-1.5">{tx.seedType}</td>
                    <td className="px-3 py-1.5">{tx.quantity}</td>
                    <td className="px-3 py-1.5">{tx.unit}</td>
                    <td className="px-3 py-1.5">{fmt(tx.unitRate)}</td>
                    <td className="px-3 py-1.5 font-semibold">
                      {fmt(tx.amountPaid)}
                    </td>
                    <td
                      className="px-3 py-1.5"
                      style={{
                        color: tx.amountDue > 0 ? TERRA : "inherit",
                      }}
                    >
                      {fmt(tx.amountDue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    background: "oklch(0.94 0.035 85)",
                    borderTop: `2px solid ${GOLD}`,
                  }}
                >
                  <td colSpan={5} className="px-3 py-2 font-bold text-right">
                    Totals:
                  </td>
                  <td className="px-3 py-2 font-bold" style={{ color: GREEN }}>
                    {fmt(totalPaid)}
                  </td>
                  <td className="px-3 py-2 font-bold" style={{ color: TERRA }}>
                    {fmt(totalDue)}
                  </td>
                </tr>
              </tfoot>
            </table>
            {totalDue > 0 && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{ background: "oklch(0.96 0.04 33)", color: TERRA }}
              >
                <strong>Amount Due:</strong> {fmt(totalDue)} \u2014 Please clear
                at earliest.
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4 no-print">
            <Button
              data-ocid="bill.print.button"
              onClick={() => window.print()}
              style={{ background: GREEN, color: "white" }}
            >
              <Receipt className="w-4 h-4 mr-1" /> Print Bill
            </Button>
            <Button
              variant="outline"
              data-ocid="bill.close_button"
              onClick={() => setBillOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PersonPageProps {
  type: "customer" | "supplier";
}

export function PersonListPage({ type }: PersonPageProps) {
  const { data, addCustomer, addSupplier, deleteCustomer, deleteSupplier } =
    useData();
  const [selected, setSelected] = useState<Customer | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
  });

  const isSupplier = type === "supplier";
  const people = isSupplier ? data.suppliers : data.customers;
  const label = isSupplier ? "Supplier" : "Customer";

  const filtered = useMemo(
    () =>
      people.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.phone.includes(search),
      ),
    [people, search],
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }
    if (isSupplier) addSupplier(form);
    else addCustomer(form);
    toast.success(`${label} added!`);
    setAddOpen(false);
    setForm({ name: "", address: "", phone: "", notes: "" });
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSupplier) deleteSupplier(id);
    else deleteCustomer(id);
    toast.success(`${label} deleted`);
  };

  if (selected) {
    const updated = people.find((p) => p.id === selected.id) ?? selected;
    return (
      <CustomerDetail
        customer={updated as Customer}
        onBack={() => setSelected(null)}
        isSupplier={isSupplier}
      />
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="font-display font-bold text-2xl"
            style={{ color: GREEN }}
          >
            {label}s
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} {label.toLowerCase()}s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder={`Search ${label.toLowerCase()}s...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid={`${type}.search_input`}
            className="w-48"
          />
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                data-ocid={`${type}.add.open_modal_button`}
                style={{ background: GREEN, color: "white" }}
              >
                <Plus className="w-4 h-4 mr-1" /> Add {label}
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid={`${type}.add.dialog`}>
              <DialogHeader>
                <DialogTitle className="font-display" style={{ color: GREEN }}>
                  Add {label}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-3 mt-3">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid={`${type}.name.input`}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    data-ocid={`${type}.phone.input`}
                    placeholder="10-digit number"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                    data-ocid={`${type}.address.textarea`}
                    placeholder="Full address"
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Input
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    data-ocid={`${type}.notes.input`}
                    placeholder="Optional notes"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    type="submit"
                    data-ocid={`${type}.add.submit_button`}
                    style={{ background: GREEN, color: "white" }}
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid={`${type}.add.cancel_button`}
                    onClick={() => setAddOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div
        className="bg-white rounded-xl shadow-card overflow-hidden"
        style={{ border: "1px solid oklch(0.88 0.04 85)" }}
      >
        {filtered.length === 0 ? (
          <div
            data-ocid={`${type}.empty_state`}
            className="text-center py-16 text-muted-foreground"
          >
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No {label.toLowerCase()}s found. Add one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "oklch(0.94 0.035 85)",
                    borderBottom: "1px solid oklch(0.88 0.03 85)",
                  }}
                >
                  {[
                    "Name",
                    "Phone",
                    "Address",
                    "Total Paid",
                    "Total Due",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold"
                      style={{ color: "oklch(0.45 0.03 148)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((person, i) => {
                  const totalPaid = person.transactions.reduce(
                    (a, t) => a + t.amountPaid,
                    0,
                  );
                  const totalDue = person.transactions.reduce(
                    (a, t) => a + t.amountDue,
                    0,
                  );
                  return (
                    <tr
                      key={person.id}
                      data-ocid={`${type}.item.${i + 1}`}
                      className="border-b last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                      style={{ borderColor: "oklch(0.93 0.02 85)" }}
                      onClick={() => setSelected(person as Customer)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelected(person as Customer);
                      }}
                      tabIndex={0}
                    >
                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: GREEN }}
                      >
                        {person.name}
                      </td>
                      <td className="px-4 py-3">{person.phone}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                        {person.address}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {fmt(totalPaid)}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{
                          color: totalDue > 0 ? TERRA : "oklch(0.45 0.1 148)",
                        }}
                      >
                        {fmt(totalDue)}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-ocid={`${type}.delete_button.${i + 1}`}
                          onClick={(e) => handleDelete(person.id, e)}
                          style={{ color: TERRA }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
