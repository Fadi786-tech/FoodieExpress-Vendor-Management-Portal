import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Clock, MapPin, Power, Save, CreditCard } from "lucide-react";
import { dataService } from "../services/dataService";
import toast from "react-hot-toast";

interface OperationsData {
  isOpen: boolean;
  minOrderValue: number;
  deliveryRadius: number;
  codEnabled: boolean;
  cardEnabled: boolean;
  hours: Record<string, { open: string; close: string; active: boolean }>;
}

export function StoreOperations() {
  const [operations, setOperations] = useState<OperationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [minOrder, setMinOrder] = useState<string>("");
  const [radius, setRadius] = useState<string>("");

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    try {
      const data = await dataService.getOperations();
      setOperations(data);
      setMinOrder(data.minOrderValue.toString());
      setRadius(data.deliveryRadius.toString());
    } catch (error) {
      console.error('Error fetching operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOperations = async (updates: Partial<OperationsData>, silent = false) => {
    if (!operations) return;
    const newOps = { ...operations, ...updates };
    setOperations(newOps);
    try {
      await dataService.updateOperations(newOps);
      if (!silent) {
        toast.success('Settings updated');
      }
    } catch (error) {
      console.error('Error updating operations:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleSaveDeliverySettings = async () => {
    if (!operations) return;
    setSaving(true);
    try {
      const updatedOps = {
        ...operations,
        minOrderValue: Number(minOrder),
        deliveryRadius: Number(radius)
      };
      await dataService.updateOperations(updatedOps);
      setOperations(updatedOps);
      toast.success('Delivery settings saved successfully');
    } catch (error) {
      toast.error('Failed to save delivery settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      if (operations) {
        const finalOps = {
          ...operations,
          minOrderValue: Number(minOrder),
          deliveryRadius: Number(radius)
        };
        await dataService.updateOperations(finalOps);
        setOperations(finalOps);
        toast.success('All changes saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !operations) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Store Operations</h2>
        <p className="text-gray-500">Manage your store's availability, hours, and delivery zones.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5 text-orange-600" />
              Store Status
            </CardTitle>
            <CardDescription>Toggle your store's online visibility.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div>
                <h4 className="font-semibold text-gray-900">Currently {operations.isOpen ? 'Accepting Orders' : 'Closed'}</h4>
                <p className="text-sm text-gray-500">
                  {operations.isOpen 
                    ? 'Customers can see your store and place orders.' 
                    : 'Your store is hidden from customers.'}
                </p>
              </div>
              <button
                onClick={() => updateOperations({ isOpen: !operations.isOpen })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 ${
                  operations.isOpen ? 'bg-orange-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    operations.isOpen ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              Delivery Settings
            </CardTitle>
            <CardDescription>Configure minimum order value and delivery radius.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Minimum Order Value (Rs.)</label>
              <input 
                type="number" 
                value={minOrder} 
                onChange={(e) => setMinOrder(e.target.value)} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Delivery Radius (km)</label>
              <input 
                type="number" 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <Button className="w-full mt-2" onClick={handleSaveDeliverySettings} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Delivery Settings'}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Payment Methods
            </CardTitle>
            <CardDescription>Configure accepted payment methods for your store.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <div>
                <h4 className="font-semibold text-gray-900">Cash on Delivery (COD)</h4>
                <p className="text-sm text-gray-500">Allow customers to pay in cash upon delivery.</p>
              </div>
              <input type="checkbox" checked={operations.codEnabled} onChange={(e) => updateOperations({ codEnabled: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
              <div>
                <h4 className="font-semibold text-gray-900">Credit/Debit Card</h4>
                <p className="text-sm text-gray-500">Accept online card payments securely.</p>
              </div>
              <input type="checkbox" checked={operations.cardEnabled} onChange={(e) => updateOperations({ cardEnabled: e.target.checked })} className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Operating Hours
            </CardTitle>
            <CardDescription>Set your regular weekly operating hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center gap-4 w-1/3">
                    <input type="checkbox" checked={operations.hours[day]?.active} onChange={(e) => {
                      const newHours = { ...operations.hours, [day]: { ...operations.hours[day], active: e.target.checked } };
                      updateOperations({ hours: newHours });
                    }} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" />
                    <span className="font-medium text-gray-700">{day}</span>
                  </div>
                  <div className="flex items-center gap-4 w-2/3 justify-end">
                    <input type="time" value={operations.hours[day]?.open} onChange={(e) => {
                      const newHours = { ...operations.hours, [day]: { ...operations.hours[day], open: e.target.value } };
                      updateOperations({ hours: newHours });
                    }} disabled={!operations.hours[day]?.active} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50" />
                    <span className="text-gray-500">to</span>
                    <input type="time" value={operations.hours[day]?.close} onChange={(e) => {
                      const newHours = { ...operations.hours, [day]: { ...operations.hours[day], close: e.target.value } };
                      updateOperations({ hours: newHours });
                    }} disabled={!operations.hours[day]?.active} className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveAll} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Hours'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
