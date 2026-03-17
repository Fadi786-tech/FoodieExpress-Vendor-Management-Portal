import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/Table";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { ArrowDownToLine, CreditCard, DollarSign, Wallet, AlertCircle } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: string;
  type: string;
}

export function Payments() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/payments');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = () => {
    if (transactions.length === 0) {
      setAlertModal({ isOpen: true, message: "No transactions available to download." });
      return;
    }

    const headers = ["Transaction ID", "Date", "Type", "Amount", "Status"];
    const csvRows = [
      headers.join(","),
      ...transactions.map(trx => [
        trx.id,
        trx.date,
        trx.type,
        `Rs. ${trx.amount}`,
        trx.status
      ].join(","))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments & Earnings</h2>
          <p className="text-gray-500">Track your revenue, payouts, and transaction history.</p>
        </div>
        <Button onClick={handleDownloadStatement}>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Download Statement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 345,000</div>
            <p className="text-xs text-gray-500 mt-1">Next payout scheduled for Oct 30</p>
            <Button className="w-full mt-4" variant="outline">Request Early Payout</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 4,523,189</div>
            <p className="text-xs text-green-500 mt-1">+15% compared to last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payout Method</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center border">
                <span className="font-bold text-blue-800">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <Button variant="link" className="px-0 mt-2 h-auto text-orange-600">Update Payment Method</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((trx) => (
                <TableRow key={trx.id}>
                  <TableCell className="font-medium">{trx.id}</TableCell>
                  <TableCell>{trx.date}</TableCell>
                  <TableCell>{trx.type}</TableCell>
                  <TableCell>Rs. {trx.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="success">{trx.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-gray-900">Notice</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {alertModal.message}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setAlertModal({ isOpen: false, message: "" })}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
