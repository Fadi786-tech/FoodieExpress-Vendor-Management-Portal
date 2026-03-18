import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/Table";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Eye, Printer, Search, Filter, MessageSquare, CheckCircle, XCircle, Clock, ChefHat, Package, Truck, AlertCircle } from "lucide-react";
import { dataService } from "../services/dataService";

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

const ORDER_STATUSES = ["Pending", "Confirmed", "Preparing", "Ready", "Out for Delivery", "Delivered", "Cancelled"];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Pending": return <Badge variant="secondary">{status}</Badge>;
    case "Confirmed": return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">{status}</Badge>;
    case "Preparing": return <Badge variant="warning">{status}</Badge>;
    case "Ready": return <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">{status}</Badge>;
    case "Out for Delivery": return <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">{status}</Badge>;
    case "Delivered": return <Badge variant="success">{status}</Badge>;
    case "Cancelled": return <Badge variant="destructive">{status}</Badge>;
    default: return <Badge variant="default">{status}</Badge>;
  }
};

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchOrders = async () => {
    try {
      const data = await dataService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await dataService.updateOrder(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      setNotification({ message: `Order ${orderId} status updated to ${newStatus}`, type: 'success' });
    } catch (error) {
      console.error('Error updating order status:', error);
      setNotification({ message: "Failed to update order status", type: 'error' });
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    const headers = ["Order ID", "Customer", "Date", "Items", "Total", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(o => [
        o.id,
        `"${o.customer}"`,
        new Date(o.date).toLocaleString(),
        o.items,
        o.total,
        o.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotification({ message: "Orders exported successfully!", type: 'success' });
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #ea580c; }
            .info { margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            .table th { background: #f9fafb; font-size: 12px; text-transform: uppercase; color: #666; }
            .total-section { display: flex; justify-content: flex-end; }
            .total-box { width: 250px; background: #f9fafb; padding: 20px; border-radius: 8px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .grand-total { font-size: 18px; font-weight: bold; color: #ea580c; border-top: 1px solid #ddd; pt: 10px; margin-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">FoodieExpress</div>
              <p>Vendor Portal Invoice</p>
            </div>
            <div style="text-align: right">
              <h3>INVOICE</h3>
              <p>#${order.id}</p>
            </div>
          </div>
          
          <div class="info">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
              <div>
                <p style="font-weight: bold; margin-bottom: 5px;">Billed To:</p>
                <p>${order.customer}</p>
                <p>Customer ID: CUST-${Math.floor(Math.random() * 10000)}</p>
              </div>
              <div style="text-align: right">
                <p style="font-weight: bold; margin-bottom: 5px;">Order Details:</p>
                <p>Date: ${new Date(order.date).toLocaleString()}</p>
                <p>Status: ${order.status}</p>
              </div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Food Items (Assorted)</td>
                <td>${order.items}</td>
                <td>Rs. ${(order.total - 150).toLocaleString()}</td>
                <td>Rs. ${(order.total - 150).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Delivery Fee</td>
                <td>1</td>
                <td>Rs. 150</td>
                <td>Rs. 150</td>
              </tr>
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-box">
              <div class="total-row">
                <span>Subtotal</span>
                <span>Rs. ${(order.total - 150).toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Tax (0%)</span>
                <span>Rs. 0</span>
              </div>
              <div class="total-row">
                <span>Delivery</span>
                <span>Rs. 150</span>
              </div>
              <div class="total-row grand-total">
                <span>Total</span>
                <span>Rs. ${order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style="margin-top: 50px; text-align: center; color: #999; font-size: 12px;">
            <p>Thank you for your business!</p>
            <p>This is a computer generated invoice.</p>
          </div>

          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    setNotification({ message: "Invoice sent to printer", type: 'success' });
  };

  const handleSMSUpdate = (order: Order) => {
    // Mock SMS sending
    setNotification({ message: `SMS update sent to ${order.customer} regarding order ${order.id}`, type: 'success' });
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case "Pending": return { label: "Confirm", next: "Confirmed", icon: <CheckCircle className="h-4 w-4" /> };
      case "Confirmed": return { label: "Start Preparing", next: "Preparing", icon: <ChefHat className="h-4 w-4" /> };
      case "Preparing": return { label: "Mark Ready", next: "Ready", icon: <Package className="h-4 w-4" /> };
      case "Ready": return { label: "Dispatch", next: "Out for Delivery", icon: <Truck className="h-4 w-4" /> };
      case "Out for Delivery": return { label: "Mark Delivered", next: "Delivered", icon: <CheckCircle className="h-4 w-4" /> };
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-full ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-gray-500">Manage your incoming orders and their status.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <select 
              className="pl-9 pr-4 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              {ORDER_STATUSES.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full rounded-md border border-gray-300 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const action = getNextAction(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>Rs. {order.total.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {action && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                            onClick={() => handleStatusChange(order.id, action.next)}
                          >
                            {action.icon}
                            <span className="ml-2 hidden lg:inline">{action.label}</span>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Send SMS Update"
                          onClick={() => handleSMSUpdate(order)}
                        >
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="View Details"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          title="Print Invoice"
                          onClick={() => handlePrintInvoice(order)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredOrders.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No orders found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details: {selectedOrder.id}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.date).toLocaleString()}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <XCircle className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Customer</p>
                  <p className="text-lg font-medium">{selectedOrder.customer}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Status</p>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Order Summary</p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Items ({selectedOrder.items})</span>
                    <span>Rs. {(selectedOrder.total - 150).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>Rs. 150</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">Rs. {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map(status => (
                    <Button 
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      size="sm"
                      className={selectedOrder.status === status ? "bg-orange-600 hover:bg-orange-700" : ""}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-between gap-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(selectedOrder)}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Button>
                <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleSMSUpdate(selectedOrder)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  SMS Update
                </Button>
              </div>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
