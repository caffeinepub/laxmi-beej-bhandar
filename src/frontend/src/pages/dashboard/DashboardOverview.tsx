import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Package, Receipt, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useData } from "../../contexts/DataContext";
import { ANNUAL_SALES, MONTHLY_SALES_2025 } from "../../contexts/initialData";

const GREEN = "oklch(0.22 0.06 148)";
const GOLD = "#C89A3A";
const TERRA = "#B85A3A";

function fmt(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export default function DashboardOverview() {
  const { data } = useData();

  const metrics = useMemo(() => {
    const totalSales = MONTHLY_SALES_2025.reduce((a, m) => a + m.sales, 0);
    const totalProfit = MONTHLY_SALES_2025.reduce((a, m) => a + m.profit, 0);
    const totalDue = data.customers.reduce(
      (a, c) => a + c.transactions.reduce((b, t) => b + t.amountDue, 0),
      0,
    );
    const stockValue = data.stock.reduce(
      (a, s) =>
        a +
        (s.bags + s.packets) * s.sellPrice +
        s.kg * s.sellPrice +
        s.grams * (s.sellPrice / 1000),
      0,
    );
    return { totalSales, totalProfit, totalDue, stockValue };
  }, [data]);

  const recentTransactions = useMemo(() => {
    const txs: Array<{
      date: string;
      customer: string;
      seed: string;
      amount: number;
      due: number;
    }> = [];
    for (const c of data.customers) {
      for (const t of c.transactions) {
        txs.push({
          date: t.date,
          customer: c.name,
          seed: t.seedType,
          amount: t.amountPaid,
          due: t.amountDue,
        });
      }
    }
    return txs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [data]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1
          className="font-display font-bold text-2xl"
          style={{ color: GREEN }}
        >
          Dashboard Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Welcome back! Here's your business at a glance.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Annual Sales (2025)",
            value: fmt(metrics.totalSales),
            icon: <TrendingUp className="w-5 h-5" />,
            color: GREEN,
          },
          {
            label: "Total Profit",
            value: fmt(metrics.totalProfit),
            icon: <Receipt className="w-5 h-5" />,
            color: "oklch(0.38 0.07 148)",
          },
          {
            label: "Total Due",
            value: fmt(metrics.totalDue),
            icon: <AlertCircle className="w-5 h-5" />,
            color: TERRA,
          },
          {
            label: "Stock Value",
            value: fmt(metrics.stockValue),
            icon: <Package className="w-5 h-5" />,
            color: "oklch(0.55 0.12 80)",
          },
        ].map(({ label, value, icon, color }) => (
          <Card key={label} className="shadow-card" data-ocid="dashboard.card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p
                    className="text-2xl font-bold font-display"
                    style={{ color }}
                  >
                    {value}
                  </p>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `${color}1A`, color }}
                >
                  {icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Bar Chart */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base font-display"
              style={{ color: GREEN }}
            >
              Monthly Sales 2025 (₹)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={MONTHLY_SALES_2025}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0.03 85)"
                />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v: number) => [
                    `₹${v.toLocaleString("en-IN")}`,
                    "",
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill={GREEN}
                  name="Sales"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="profit"
                  fill={GOLD}
                  name="Profit"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Annual Line Chart */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle
              className="text-base font-display"
              style={{ color: GREEN }}
            >
              Annual Trend (3 Years)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={ANNUAL_SALES}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.88 0.03 85)"
                />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(v) => `${(v / 100000).toFixed(1)}L`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(v: number) => [
                    `₹${v.toLocaleString("en-IN")}`,
                    "",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={GREEN}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke={GOLD}
                  strokeWidth={2.5}
                  dot={{ r: 5 }}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: GREEN }} />
            <CardTitle
              className="text-base font-display"
              style={{ color: GREEN }}
            >
              Recent Transactions
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    background: "oklch(0.94 0.035 85)",
                    borderBottom: "1px solid oklch(0.88 0.03 85)",
                  }}
                >
                  {["Date", "Customer", "Seed", "Paid", "Due"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left text-xs font-semibold"
                      style={{ color: "oklch(0.45 0.03 148)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, i) => (
                  <tr
                    key={`${tx.customer}-${tx.date}-${i}`}
                    data-ocid={`transactions.item.${i + 1}`}
                    className="border-b last:border-0"
                    style={{ borderColor: "oklch(0.93 0.02 85)" }}
                  >
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {tx.date}
                    </td>
                    <td
                      className="px-4 py-2.5 text-xs font-medium"
                      style={{ color: GREEN }}
                    >
                      {tx.customer}
                    </td>
                    <td className="px-4 py-2.5 text-xs">{tx.seed}</td>
                    <td className="px-4 py-2.5 text-xs font-semibold">
                      ₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                    <td
                      className="px-4 py-2.5 text-xs"
                      style={{
                        color: tx.due > 0 ? TERRA : "oklch(0.45 0.1 148)",
                      }}
                    >
                      ₹{tx.due.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
