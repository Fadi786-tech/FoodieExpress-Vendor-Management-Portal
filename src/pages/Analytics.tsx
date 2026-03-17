import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import { Download, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/src/components/ui/Button";

interface SalesData {
  name: string;
  sales: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: string;
}

interface PeakHour {
  time: string;
  orders: number;
}

export function Analytics() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [peakHoursData, setPeakHoursData] = useState<PeakHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setSalesData(data.salesData);
      setTopProducts(data.topProducts);
      setPeakHoursData(data.peakHoursData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (salesData.length === 0) return;

    const headers = ["Day", "Sales (Rs.)"];
    const csvRows = [
      headers.join(","),
      ...salesData.map(data => [data.name, data.sales].join(","))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics & Reports</h2>
          <p className="text-gray-500">Dive deep into your store's performance metrics.</p>
        </div>
        <Button variant="outline" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs. ${value}`} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="sales" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="font-medium text-sm">{product.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Peak Hours Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={peakHoursData}>
                  <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Line type="monotone" dataKey="orders" stroke="#ea580c" strokeWidth={3} dot={{ r: 4, fill: "#ea580c" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">Busiest hours to optimize staffing and preparation.</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Customer Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">68%</div>
              <p className="text-xs text-green-500 flex items-center mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% from last month
              </p>
              <p className="text-sm text-gray-500 mt-4">Percentage of customers who return within 30 days.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Average Preparation Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">14 min</div>
              <p className="text-xs text-green-500 flex items-center mt-2">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -2 min from last week
              </p>
              <p className="text-sm text-gray-500 mt-4">Average time taken to prepare an order.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
