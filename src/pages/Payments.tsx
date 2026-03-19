import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/Table";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { ArrowDownToLine, CreditCard, DollarSign, Wallet, AlertCircle, Check } from "lucide-react";
import { dataService } from "../services/dataService";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: string;
  type: string;
}

export function Payments() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(345000);
  const [loading, setLoading] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("VISA-4242");
  const [isProcessing, setIsProcessing] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trxs, currentBalance] = await Promise.all([
        dataService.getPayments(),
        dataService.getBalance()
      ]);
      setTransactions(trxs);
      setBalance(currentBalance);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStatement = () => {
    if (transactions.length === 0) {
      toast.error("No transactions available to download.");
      return;
    }
    toast.success("Downloading statement...");
  };

  const handleEarlyPayout = async () => {
    if (balance <= 0) {
      toast.error("No balance available for payout.");
      return;
    }
    setShowPayoutModal(true);
  };

  const confirmPayout = async () => {
    const payoutAmount = balance;
    setIsProcessing(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Update balance to 0
      await dataService.updateBalance(0);
      setBalance(0);

      // Add transaction
      await dataService.addTransaction({
        amount: payoutAmount,
        status: "Completed",
        type: `Early Payout (${selectedPaymentMethod})`
      });
      
      // Refresh transactions
      const updatedTrxs = await dataService.getPayments();
      setTransactions(updatedTrxs);
      
      toast.success(`Early payout of Rs. ${payoutAmount.toLocaleString()} initiated to ${selectedPaymentMethod}!`);
      setShowPayoutModal(false);
    } catch (error) {
      toast.error("Failed to initiate early payout. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
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
            <div className="text-2xl font-bold">Rs. {balance.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Next payout scheduled for Oct 30</p>
            <Button className="w-full mt-4" variant="outline" onClick={handleEarlyPayout} disabled={balance <= 0}>
              {balance <= 0 ? "No Balance Available" : "Request Early Payout"}
            </Button>
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

      {/* Payout Confirmation Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-orange-600 px-6 py-4 text-white">
              <h3 className="text-lg font-bold">Confirm Early Payout</h3>
              <p className="text-orange-100 text-sm">Review your payout details before proceeding.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total Payout Amount</p>
                <p className="text-3xl font-bold text-gray-900">Rs. {balance.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Select Payout Method</label>
                <div className="grid gap-3">
                  <button 
                    onClick={() => setSelectedPaymentMethod("VISA-4242")}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedPaymentMethod === "VISA-4242" ? 'border-orange-600 bg-orange-50 ring-1 ring-orange-600' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-12 bg-white rounded border flex items-center justify-center text-[10px] font-bold text-blue-800">VISA</div>
                      <div className="text-left">
                        <p className="text-sm font-medium">VISA •••• 4242</p>
                        <p className="text-xs text-gray-500">Primary Account</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === "VISA-4242" && <div className="h-4 w-4 rounded-full bg-orange-600 flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div>}
                  </button>

                  <button 
                    onClick={() => setSelectedPaymentMethod("Bank Transfer")}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedPaymentMethod === "Bank Transfer" ? 'border-orange-600 bg-orange-50 ring-1 ring-orange-600' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-12 bg-white rounded border flex items-center justify-center"><Wallet className="h-4 w-4 text-gray-400" /></div>
                      <div className="text-left">
                        <p className="text-sm font-medium">Bank Transfer</p>
                        <p className="text-xs text-gray-500">HBL Account •••• 8901</p>
                      </div>
                    </div>
                    {selectedPaymentMethod === "Bank Transfer" && <div className="h-4 w-4 rounded-full bg-orange-600 flex items-center justify-center"><Check className="h-2.5 w-2.5 text-white" /></div>}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Early payouts are processed within 2-4 hours. A standard processing fee of 1.5% may apply.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowPayoutModal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-orange-600 hover:bg-orange-700" 
                  onClick={confirmPayout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Confirm Payout"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
