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
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Edit2, ImagePlus, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import type { StockItem } from "../../types";

const GREEN = "oklch(0.22 0.06 148)";
const TERRA = "oklch(0.52 0.15 33)";
const GOLD = "oklch(0.72 0.13 80)";

const CATEGORIES = ["Cereal", "Vegetable", "Oilseed", "Pulse"];

type ItemForm = Omit<StockItem, "id">;

const EMPTY_FORM: ItemForm = {
  name: "",
  category: "Cereal",
  bags: 0,
  packets: 0,
  kg: 0,
  grams: 0,
  costPrice: 0,
  sellPrice: 0,
  reorderLevel: 5,
  description: "",
  imageUrl: "",
};

export default function StockPage() {
  const { data, addStockItem, updateStockItem, deleteStockItem } = useData();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<StockItem | null>(null);
  const [form, setForm] = useState<ItemForm>(EMPTY_FORM);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((p) => ({ ...p, imageUrl: url }));
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditItem(null);
    setAddOpen(true);
  };

  const openEdit = (item: StockItem) => {
    setForm({ ...item });
    setEditItem(item);
    setAddOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Product name is required");
      return;
    }
    if (editItem) {
      updateStockItem(editItem.id, form);
      toast.success("Stock item updated!");
    } else {
      addStockItem(form);
      toast.success("Stock item added!");
    }
    setAddOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteStockItem(id);
    toast.success("Item deleted");
  };

  const stockItems = data.stock;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-display font-bold text-2xl"
            style={{ color: GREEN }}
          >
            Stock / Inventory
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stockItems.length} products
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="stock.add.open_modal_button"
              onClick={openAdd}
              style={{ background: GREEN, color: "white" }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-lg max-h-[90vh] overflow-y-auto"
            data-ocid="stock.add.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display" style={{ color: GREEN }}>
                {editItem ? "Edit Product" : "Add Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-3">
              {/* Image Upload */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer"
                  style={{
                    border: `2px dashed ${GOLD}`,
                    background: "oklch(0.97 0.02 85)",
                  }}
                  onClick={() => fileRef.current?.click()}
                  data-ocid="stock.upload_button"
                >
                  {form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="w-6 h-6" style={{ color: GOLD }} />
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium">Product Image</p>
                  <p className="text-xs text-muted-foreground">
                    Click to upload
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="stock.name.input"
                    placeholder="e.g. Maize Hybrid"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input px-3 text-sm bg-background"
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    data-ocid="stock.category.select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Quantity by Unit
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {(["bags", "packets", "kg", "grams"] as const).map((unit) => (
                    <div key={unit}>
                      <Label className="capitalize text-xs">{unit}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form[unit]}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            [unit]: Number(e.target.value),
                          }))
                        }
                        data-ocid={`stock.${unit}.input`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Cost Price (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.costPrice}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        costPrice: Number(e.target.value),
                      }))
                    }
                    data-ocid="stock.cost.input"
                  />
                </div>
                <div>
                  <Label>Sell Price (₹)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.sellPrice}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        sellPrice: Number(e.target.value),
                      }))
                    }
                    data-ocid="stock.sell.input"
                  />
                </div>
                <div>
                  <Label>Reorder Level</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.reorderLevel}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        reorderLevel: Number(e.target.value),
                      }))
                    }
                    data-ocid="stock.reorder.input"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  data-ocid="stock.description.textarea"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  data-ocid="stock.save.submit_button"
                  style={{ background: GREEN, color: "white" }}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="stock.cancel_button"
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {stockItems.length === 0 ? (
        <div
          data-ocid="stock.empty_state"
          className="text-center py-20 text-muted-foreground"
        >
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No stock items yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stockItems.map((item, i) => {
            const totalStock =
              item.bags + item.packets + item.kg + item.grams / 1000;
            const isLow = totalStock <= item.reorderLevel;
            return (
              <div
                key={item.id}
                data-ocid={`stock.item.${i + 1}`}
                className="bg-white rounded-xl shadow-card overflow-hidden"
                style={{
                  border: `1px solid ${isLow ? "oklch(0.65 0.12 33)" : "oklch(0.88 0.04 85)"}`,
                }}
              >
                <div className="relative h-32 bg-muted">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "oklch(0.94 0.035 85)" }}
                    >
                      <Package className="w-10 h-10" style={{ color: GOLD }} />
                    </div>
                  )}
                  {isLow && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        style={{ background: TERRA, color: "white" }}
                        className="text-xs flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3" /> Low
                      </Badge>
                    </div>
                  )}
                  <Badge
                    className="absolute top-2 left-2 text-xs"
                    style={{ background: GREEN, color: "white" }}
                  >
                    {item.category}
                  </Badge>
                </div>
                <div className="p-3">
                  <h3
                    className="font-display font-semibold text-sm mb-2 truncate"
                    style={{ color: GREEN }}
                  >
                    {item.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                    {item.bags > 0 && (
                      <span className="text-muted-foreground">
                        {item.bags} Bags
                      </span>
                    )}
                    {item.packets > 0 && (
                      <span className="text-muted-foreground">
                        {item.packets} Packets
                      </span>
                    )}
                    {item.kg > 0 && (
                      <span className="text-muted-foreground">
                        {item.kg} Kg
                      </span>
                    )}
                    {item.grams > 0 && (
                      <span className="text-muted-foreground">
                        {item.grams} g
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Sell</p>
                      <p className="font-bold text-sm" style={{ color: GREEN }}>
                        ₹{item.sellPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Cost</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.costPrice}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      data-ocid={`stock.edit_button.${i + 1}`}
                      onClick={() => openEdit(item)}
                      style={{ borderColor: GREEN, color: GREEN }}
                    >
                      <Edit2 className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`stock.delete_button.${i + 1}`}
                      onClick={() => handleDelete(item.id)}
                      style={{ borderColor: TERRA, color: TERRA }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { Package } from "lucide-react";
