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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Leaf, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useData } from "../../contexts/DataContext";
import type { SeedCatalogItem } from "../../types";

const GREEN = "oklch(0.22 0.06 148)";
const TERRA = "oklch(0.52 0.15 33)";
const GOLD = "oklch(0.72 0.13 80)";

const CATEGORIES = ["All", "Cereal", "Vegetable", "Oilseed", "Pulse"] as const;
type CatFilter = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Cereal: { bg: "oklch(0.92 0.08 80)", color: "oklch(0.45 0.12 80)" },
  Vegetable: { bg: "oklch(0.9 0.1 148)", color: "oklch(0.3 0.1 148)" },
  Oilseed: { bg: "oklch(0.92 0.08 55)", color: "oklch(0.42 0.12 55)" },
  Pulse: { bg: "oklch(0.92 0.08 33)", color: "oklch(0.42 0.12 33)" },
};

const CATEGORY_ICONS: Record<string, string> = {
  Cereal: "🌾",
  Vegetable: "🥦",
  Oilseed: "🌱",
  Pulse: "🌰",
};

export default function SeedCatalogPage() {
  const { data, addSeedCatalogItem, deleteSeedCatalogItem } = useData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CatFilter>("All");
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Omit<SeedCatalogItem, "id">>({
    name: "",
    category: "Cereal",
    description: "",
    season: "",
    region: "",
  });

  const filtered = useMemo(() => {
    return data.seedCatalog.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === "All" || s.category === category;
      return matchesSearch && matchesCat;
    });
  }, [data.seedCatalog, search, category]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Seed name is required");
      return;
    }
    addSeedCatalogItem(form);
    toast.success("Seed added to catalog!");
    setAddOpen(false);
    setForm({
      name: "",
      category: "Cereal",
      description: "",
      season: "",
      region: "",
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="font-display font-bold text-2xl"
            style={{ color: GREEN }}
          >
            Seed Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data.seedCatalog.length} varieties
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="seeds.add.open_modal_button"
              style={{ background: GREEN, color: "white" }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Seed
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="seeds.add.dialog">
            <DialogHeader>
              <DialogTitle className="font-display" style={{ color: GREEN }}>
                Add Seed to Catalog
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Seed Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="seeds.name.input"
                    placeholder="e.g. Broccoli"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input px-3 text-sm bg-background"
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        category: e.target.value as SeedCatalogItem["category"],
                      }))
                    }
                    data-ocid="seeds.category.select"
                  >
                    {["Cereal", "Vegetable", "Oilseed", "Pulse"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Season</Label>
                  <Input
                    value={form.season}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, season: e.target.value }))
                    }
                    data-ocid="seeds.season.input"
                    placeholder="e.g. Kharif"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Input
                    value={form.region}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, region: e.target.value }))
                    }
                    data-ocid="seeds.region.input"
                    placeholder="e.g. All India"
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
                  data-ocid="seeds.description.textarea"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  data-ocid="seeds.add.submit_button"
                  style={{ background: GREEN, color: "white" }}
                >
                  Add Seed
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="seeds.add.cancel_button"
                  onClick={() => setAddOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Category Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search seeds..."
            data-ocid="seeds.search_input"
            className="pl-9 w-48"
          />
        </div>
        <Tabs
          value={category}
          onValueChange={(v) => setCategory(v as CatFilter)}
        >
          <TabsList>
            {CATEGORIES.map((c) => (
              <TabsTrigger
                key={c}
                value={c}
                data-ocid={`seeds.${c.toLowerCase()}.tab`}
              >
                {CATEGORY_ICONS[c] ?? ""} {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          data-ocid="seeds.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Leaf className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No seeds found matching your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((seed, i) => (
            <div
              key={seed.id}
              data-ocid={`seeds.item.${i + 1}`}
              className="bg-white rounded-xl shadow-card p-4"
              style={{ border: "1px solid oklch(0.88 0.04 85)" }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {CATEGORY_ICONS[seed.category] ?? "🌱"}
                  </span>
                  <div>
                    <h3
                      className="font-display font-bold text-sm"
                      style={{ color: GREEN }}
                    >
                      {seed.name}
                    </h3>
                    <Badge
                      className="text-xs mt-0.5"
                      style={
                        CATEGORY_COLORS[seed.category] ?? {
                          bg: "oklch(0.93 0 0)",
                          color: "oklch(0.4 0 0)",
                        }
                      }
                    >
                      {seed.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  data-ocid={`seeds.delete_button.${i + 1}`}
                  onClick={() => {
                    deleteSeedCatalogItem(seed.id);
                    toast.success("Seed removed");
                  }}
                  style={{ color: TERRA, padding: "2px 4px" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p
                className="text-xs leading-relaxed mb-3"
                style={{ color: "oklch(0.45 0.02 148)" }}
              >
                {seed.description}
              </p>
              <div className="grid grid-cols-2 gap-1">
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "oklch(0.55 0.05 80)" }}
                >
                  <span style={{ color: GOLD }}>Season:</span> {seed.season}
                </div>
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "oklch(0.55 0.05 80)" }}
                >
                  <span style={{ color: GOLD }}>Region:</span> {seed.region}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
