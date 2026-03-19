import React from 'react';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Download, Wallet, CreditCard, Landmark } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Payouts() {
  const { currentVendorId, payouts } = useStore();

  const vendorPayouts = payouts.filter((p) => p.vendorId === currentVendorId);
  const totalCompleted = vendorPayouts
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleDownload = () => {
    toast.success('Downloading payout statement...');
  };

  const handleEarlyPayout = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Processing early payout request...',
        success: 'Early payout of PKR 12,500 initiated! Funds will arrive in 2-4 hours.',
        error: 'Failed to initiate early payout. Please try again later.',
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payout Management</h1>
          <p className="text-muted-foreground">Track your earnings and settlements.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEarlyPayout} className="bg-orange-600 hover:bg-orange-700">
            <Wallet className="w-4 h-4 mr-2" />
            Request Early Payout
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Statement
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 12,500</div>
            <p className="text-xs text-muted-foreground">
              Next payout on Friday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {totalCompleted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Account</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">HBL - Habib Bank Limited</div>
            <p className="text-xs text-muted-foreground">
              **** **** **** 1234
            </p>
            <Button variant="link" className="p-0 h-auto mt-2 text-xs">Update Details</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorPayouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>{format(new Date(payout.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="font-mono text-xs">{payout.id.toUpperCase()}</TableCell>
                  <TableCell className="font-medium">PKR {payout.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={payout.status === 'Completed' ? 'default' : 'secondary'} className={payout.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {vendorPayouts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No payouts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
