import { Badge } from "@/components/ui/badge";
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
import { Eye, Plus, Printer, Receipt, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { useData } from "../../contexts/DataContext";
import type { Bill, BillLineItem, UnitType } from "../../types";

const GREEN = "oklch(0.22 0.06 148)";
const TERRA = "oklch(0.52 0.15 33)";
const GOLD = "oklch(0.72 0.13 80)";

const UNITS: UnitType[] = ["Bags", "Packets", "Kg", "Grams"];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}
function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

const STATUS_COLORS: Record<Bill["status"], { bg: string; color: string }> = {
  Paid: { bg: "oklch(0.88 0.1 148)", color: "oklch(0.28 0.1 148)" },
  Unpaid: { bg: "oklch(0.92 0.08 33)", color: "oklch(0.42 0.12 33)" },
  Partial: { bg: "oklch(0.93 0.1 80)", color: "oklch(0.45 0.12 80)" },
};

function BillView({
  bill,
  storeAddress,
  storePhone,
  onClose,
}: {
  bill: Bill;
  storeAddress: string;
  storePhone: string;
  onClose: () => void;
}) {
  return (
    <div>
      <div
        className="border rounded-xl overflow-hidden"
        style={{ borderColor: GOLD }}
      >
        {/* Header */}
        <div className="text-center py-5 px-6" style={{ background: GREEN }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <img
              src="/assets/generated/lbb-logo-transparent.dim_120x120.png"
              alt="LBB"
              className="w-8 h-8 rounded-full object-cover"
            />
            <h2
              className="font-display font-bold text-lg"
              style={{ color: GOLD }}
            >
              Laxmi Beej Bhandar
            </h2>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.78 0.02 85)" }}>
            {storeAddress} | {storePhone}
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Bill meta */}
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Bill No.</p>
              <p className="font-bold font-display" style={{ color: GREEN }}>
                {bill.billNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Purchase Date</p>
              <p className="font-medium">{bill.purchaseDate}</p>
            </div>
          </div>

          {/* Customer */}
          <div
            className="p-3 rounded-lg"
            style={{ background: "oklch(0.96 0.025 85)" }}
          >
            <p className="text-xs text-muted-foreground mb-1">Bill To:</p>
            <p className="font-bold text-sm">{bill.customerName}</p>
            <p className="text-xs text-muted-foreground">
              {bill.customerAddress}
            </p>
            <p className="text-xs">{bill.customerPhone}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{bill.dueDate || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Date</p>
              <p className="font-medium">{bill.paymentDate || "—"}</p>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: GREEN }}>
                {["Product", "Qty", "Unit", "Rate", "Amount"].map((h) => (
                  <th
                    key={h}
                    className="px-2 py-2 text-left"
                    style={{ color: "white" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bill.lineItems.map((li, i) => (
                <tr
                  key={li.id}
                  style={{
                    background: i % 2 === 0 ? "white" : "oklch(0.97 0.02 85)",
                  }}
                >
                  <td className="px-2 py-1.5">{li.productName}</td>
                  <td className="px-2 py-1.5">{li.quantity}</td>
                  <td className="px-2 py-1.5">{li.unit}</td>
                  <td className="px-2 py-1.5">{fmt(li.unitRate)}</td>
                  <td className="px-2 py-1.5 font-semibold">
                    {fmt(li.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div
            className="border-t pt-3 space-y-1 text-sm"
            style={{ borderColor: GOLD }}
          >
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total</span>
              <span>{fmt(bill.totalAmount)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Discount</span>
                <span style={{ color: TERRA }}>-{fmt(bill.discount)}</span>
              </div>
            )}
            {bill.tax > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tax</span>
                <span>+{fmt(bill.tax)}</span>
              </div>
            )}
            <div
              className="flex justify-between font-bold text-base pt-1 border-t"
              style={{ borderColor: "oklch(0.88 0.03 85)" }}
            >
              <span style={{ color: GREEN }}>Final Amount</span>
              <span style={{ color: GREEN }}>{fmt(bill.finalAmount)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge style={STATUS_COLORS[bill.status]}>{bill.status}</Badge>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 no-print">
        <Button
          data-ocid="bill.print.button"
          onClick={() => window.print()}
          style={{ background: GREEN, color: "white" }}
        >
          <Printer className="w-4 h-4 mr-1" /> Print
        </Button>
        <Button
          variant="outline"
          data-ocid="bill.close_button"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default function BillingPage() {
  const { data, addBill, updateBillStatus, deleteBill } = useData();
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  // Create form
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [lineItems, setLineItems] = useState<BillLineItem[]>([
    {
      id: uid(),
      productName: "",
      quantity: 0,
      unit: "Bags",
      unitRate: 0,
      amount: 0,
    },
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const selectedCustomer = useMemo(
    () => data.customers.find((c) => c.id === selectedCustomerId),
    [data.customers, selectedCustomerId],
  );

  const totalAmount = lineItems.reduce((a, li) => a + li.amount, 0);
  const finalAmount = totalAmount - discount + tax;

  const updateLineItem = (
    id: string,
    field: keyof BillLineItem,
    value: string | number,
  ) => {
    setLineItems((prev) =>
      prev.map((li) => {
        if (li.id !== id) return li;
        const updated = { ...li, [field]: value };
        if (field === "quantity" || field === "unitRate") {
          updated.amount = updated.quantity * updated.unitRate;
        }
        return updated;
      }),
    );
  };

  const addLine = () =>
    setLineItems((p) => [
      ...p,
      {
        id: uid(),
        productName: "",
        quantity: 0,
        unit: "Bags",
        unitRate: 0,
        amount: 0,
      },
    ]);
  const removeLine = (id: string) =>
    setLineItems((p) => p.filter((li) => li.id !== id));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      toast.error("Select a customer");
      return;
    }
    addBill({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      purchaseDate,
      dueDate,
      paymentDate,
      lineItems,
      discount,
      tax,
      totalAmount,
      finalAmount,
      status: "Unpaid",
    });
    toast.success("Bill created!");
    setCreateOpen(false);
    setSelectedCustomerId("");
    setLineItems([
      {
        id: uid(),
        productName: "",
        quantity: 0,
        unit: "Bags",
        unitRate: 0,
        amount: 0,
      },
    ]);
    setDiscount(0);
    setTax(0);
    setPurchaseDate("");
    setDueDate("");
    setPaymentDate("");
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display font-bold text-2xl"
            style={{ color: GREEN }}
          >
            Billing
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data.bills.length} bills
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="billing.create.open_modal_button"
              style={{ background: GREEN, color: "white" }}
            >
              <Plus className="w-4 h-4 mr-1" /> Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
            data-ocid="billing.create.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display" style={{ color: GREEN }}>
                Create New Bill
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-3">
              {/* Customer Select */}
              <div>
                <Label>Customer *</Label>
                <Select
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                >
                  <SelectTrigger data-ocid="billing.customer.select">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {c.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Purchase Date</Label>
                  <Input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    data-ocid="billing.purchase_date.input"
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    data-ocid="billing.due_date.input"
                  />
                </div>
                <div>
                  <Label>Payment Date</Label>
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    data-ocid="billing.payment_date.input"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Line Items</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addLine}
                    data-ocid="billing.add_line.button"
                    style={{ borderColor: GREEN, color: GREEN }}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Line
                  </Button>
                </div>
                <div className="space-y-2">
                  {lineItems.map((li, i) => (
                    <div
                      key={li.id}
                      className="grid grid-cols-[1fr_60px_80px_80px_80px_32px] gap-2 items-end"
                    >
                      <div>
                        {i === 0 && <Label className="text-xs">Product</Label>}
                        <Input
                          value={li.productName}
                          onChange={(e) =>
                            updateLineItem(li.id, "productName", e.target.value)
                          }
                          placeholder="Seed name"
                          data-ocid={`billing.product.input.${i + 1}`}
                        />
                      </div>
                      <div>
                        {i === 0 && <Label className="text-xs">Qty</Label>}
                        <Input
                          type="number"
                          min={0}
                          value={li.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              li.id,
                              "quantity",
                              Number(e.target.value),
                            )
                          }
                          data-ocid={`billing.qty.input.${i + 1}`}
                        />
                      </div>
                      <div>
                        {i === 0 && <Label className="text-xs">Unit</Label>}
                        <Select
                          value={li.unit}
                          onValueChange={(v) =>
                            updateLineItem(li.id, "unit", v)
                          }
                        >
                          <SelectTrigger className="text-xs">
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
                        {i === 0 && <Label className="text-xs">Rate</Label>}
                        <Input
                          type="number"
                          min={0}
                          value={li.unitRate}
                          onChange={(e) =>
                            updateLineItem(
                              li.id,
                              "unitRate",
                              Number(e.target.value),
                            )
                          }
                          data-ocid={`billing.rate.input.${i + 1}`}
                        />
                      </div>
                      <div>
                        {i === 0 && <Label className="text-xs">Amount</Label>}
                        <Input
                          value={fmt(li.amount)}
                          readOnly
                          className="text-xs"
                          style={{ background: "oklch(0.96 0.02 85)" }}
                        />
                      </div>
                      <div>
                        {i === 0 && <div className="text-xs invisible">x</div>}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          data-ocid={`billing.remove_line.delete_button.${i + 1}`}
                          onClick={() => removeLine(li.id)}
                          disabled={lineItems.length === 1}
                          style={{ color: TERRA, padding: "0 4px" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount / Tax / Total */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Discount (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    data-ocid="billing.discount.input"
                  />
                </div>
                <div>
                  <Label>Tax (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    data-ocid="billing.tax.input"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <Label className="text-xs text-muted-foreground">
                    Final Amount
                  </Label>
                  <p
                    className="text-xl font-bold font-display"
                    style={{ color: GREEN }}
                  >
                    {fmt(finalAmount)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  data-ocid="billing.create.submit_button"
                  style={{ background: GREEN, color: "white" }}
                >
                  Create Bill
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="billing.create.cancel_button"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bills Table */}
      <div
        className="bg-white rounded-xl shadow-card overflow-hidden"
        style={{ border: "1px solid oklch(0.88 0.04 85)" }}
      >
        {data.bills.length === 0 ? (
          <div
            data-ocid="billing.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No bills yet. Create one to get started!</p>
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
                    "Bill #",
                    "Customer",
                    "Date",
                    "Amount",
                    "Status",
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
                {data.bills.map((bill, i) => (
                  <tr
                    key={bill.id}
                    data-ocid={`billing.item.${i + 1}`}
                    className="border-b last:border-0"
                    style={{ borderColor: "oklch(0.93 0.02 85)" }}
                  >
                    <td
                      className="px-4 py-3 font-mono font-medium text-xs"
                      style={{ color: GREEN }}
                    >
                      {bill.billNumber}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {bill.customerName}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {bill.purchaseDate}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {fmt(bill.finalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={bill.status}
                        onValueChange={(v) =>
                          updateBillStatus(bill.id, v as Bill["status"])
                        }
                      >
                        <SelectTrigger
                          className="w-28 h-7 text-xs"
                          data-ocid={`billing.status.select.${i + 1}`}
                          style={STATUS_COLORS[bill.status]}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          data-ocid={`billing.view.button.${i + 1}`}
                          onClick={() => setViewBill(bill)}
                          style={{ color: GREEN }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          data-ocid={`billing.delete_button.${i + 1}`}
                          onClick={() => {
                            deleteBill(bill.id);
                            toast.success("Bill deleted");
                          }}
                          style={{ color: TERRA }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Bill Dialog */}
      {viewBill && (
        <Dialog
          open={!!viewBill}
          onOpenChange={(o) => {
            if (!o) setViewBill(null);
          }}
        >
          <DialogContent
            className="max-w-xl max-h-[90vh] overflow-y-auto"
            data-ocid="billing.view.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display" style={{ color: GREEN }}>
                Bill {viewBill.billNumber}
              </DialogTitle>
            </DialogHeader>
            <BillView
              bill={viewBill}
              storeAddress={user?.address ?? ""}
              storePhone={user?.phone ?? ""}
              onClose={() => setViewBill(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
