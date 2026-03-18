import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Camera, Save, User, AlertCircle } from "lucide-react";
import { dataService } from "../services/dataService";

interface SettingsData {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  description: string;
  address: string;
  logoUrl?: string;
  coverUrl?: string;
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    storeName: "",
    ownerName: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    logoUrl: "",
    coverUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' }>({ isOpen: false, message: "", type: 'success' });
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await dataService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await dataService.updateSettings(settings);
      setSettings(data);
      setAlertModal({ isOpen: true, message: "Settings saved successfully!", type: 'success' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setAlertModal({ isOpen: true, message: "Failed to save settings.", type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all data to default? This will delete all your products, staff, and settings.")) {
      try {
        await dataService.resetData();
        window.location.reload();
      } catch (error) {
        console.error('Error resetting data:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logoUrl' | 'coverUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setSettings(prev => ({ ...prev, [type]: base64String }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-gray-500">Manage your store information, branding, and security.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Logo</CardTitle>
              <CardDescription>Update your store's profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <input 
                type="file" 
                accept="image/*" 
                ref={logoInputRef} 
                onChange={(e) => handleImageUpload(e, 'logoUrl')} 
                className="hidden" 
              />
              <div className="relative h-32 w-32 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Store Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <User className="h-12 w-12" />
                  </div>
                )}
                <button 
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-orange-600 p-2 text-white shadow-sm hover:bg-orange-700 z-10"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-xs text-gray-500 text-center">
                Recommended size: 512x512px.<br />Max file size: 2MB.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>Update your store's banner image.</CardDescription>
            </CardHeader>
            <CardContent>
              <input 
                type="file" 
                accept="image/*" 
                ref={coverInputRef} 
                onChange={(e) => handleImageUpload(e, 'coverUrl')} 
                className="hidden" 
              />
              <div 
                onClick={() => coverInputRef.current?.click()}
                className="relative h-32 w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer transition-colors overflow-hidden"
              >
                {settings.coverUrl ? (
                  <img src={settings.coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Upload Cover</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your store details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Store Name</label>
                  <input type="text" name="storeName" value={settings.storeName} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Owner Name</label>
                  <input type="text" name="ownerName" value={settings.ownerName} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" value={settings.phone} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Store Description</label>
                <textarea rows={4} name="description" value={settings.description} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Business Address</label>
                <input type="text" name="address" value={settings.address} onChange={handleChange} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-red-600">Data Management</CardTitle>
              <CardDescription>Reset your store data to its original state.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  This will delete all your products, staff, and settings and restore the default dummy data.
                </p>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                  onClick={handleResetData}
                >
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <div className={`flex items-center gap-3 mb-4 ${alertModal.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-semibold text-gray-900">
                {alertModal.type === 'success' ? 'Success' : 'Error'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {alertModal.message}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setAlertModal({ isOpen: false, message: "", type: 'success' })}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
