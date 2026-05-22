import React from 'react';
import { useAuth } from '@/App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  History, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Crown
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ProfileView({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { user, profile, isPremium, updateProfileState } = useAuth();

  const displayName = user?.displayName || profile?.displayName || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Scholar';

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    const confirmCancel = window.confirm('Are you sure you want to cancel your premium subscription? You will lose access to premium features immediately.');
    
    if (!confirmCancel) return;

    const currentBilling = profile?.billingHistory || [];
    const updatedBilling = [
      ...currentBilling,
      {
        id: `inv_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        amount: 0,
        description: 'Subscription Cancelled',
        status: 'cancelled'
      }
    ];

    try {
      if (user.isGuest) {
        updateProfileState({
          ...profile,
          isPremium: false,
          cancelledAt: new Date().toISOString(),
          billingHistory: updatedBilling
        });
        toast.success('Your subscription has been cancelled (Guest Mode).');
        return;
      }

      if (!supabase) throw new Error('Supabase client is not initialized.');

      const { error } = await supabase
        .from('users')
        .update({
          isPremium: false,
          premiumUntil: null,
          billingHistory: updatedBilling
        })
        .eq('uid', user.id);

      if (error) throw error;

      updateProfileState({
        ...profile,
        isPremium: false,
        premiumUntil: null,
        billingHistory: updatedBilling
      });

      toast.success('Your subscription has been cancelled.');
    } catch (e: any) {
      toast.error('Failed to cancel subscription: ' + e.message);
    }
  };

  const billingHistory = profile?.billingHistory || [];

  return (
    <div className="h-full bg-white">
      <ScrollArea className="h-full">
        <div className="p-4 md:p-8 pb-32 md:pb-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-light tracking-tight mb-2">User <span className="font-serif italic text-orange-600">Profile</span></h2>
              <p className="text-neutral-500 text-sm">Manage your account and subscription preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-neutral-400" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Full Name</p>
                <p className="text-sm font-medium">{displayName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Email Address</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-3 h-3 text-neutral-400" />
                  <span className="truncate">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Member Since</p>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-3 h-3" />
                  <span>{profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM d, yyyy') : 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="md:col-span-2 overflow-hidden relative">
            {isPremium && (
              <div className="absolute top-0 right-0 p-4">
                <Crown className="w-12 h-12 text-orange-500/10 rotate-12" />
              </div>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-neutral-400" />
                Subscription Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{isPremium ? 'Scholar Elite' : 'Free Trial'}</h3>
                    {isPremium ? (
                      <Badge className="bg-orange-500 text-white">PREMIUM</Badge>
                    ) : (
                      <Badge variant="secondary">BASIC</Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 italic">
                    {isPremium 
                      ? 'You have unlimited access to all AI voice scenarios and features.' 
                      : 'You are currently on a 7-day free trial of the base features.'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{isPremium ? '$1.00' : '$0.00'}</p>
                  <p className="text-xs text-neutral-400">per month</p>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {isPremium ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Status: Active
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancelSubscription}
                      className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      Upgrade to unlock all features
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-neutral-900 hover:bg-black w-full sm:w-auto"
                      onClick={() => onNavigate?.('premium')}
                    >
                      Upgrade Now
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-neutral-400" />
              Billing History
            </CardTitle>
            <CardDescription>View your past payments and transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {billingHistory.length > 0 ? (
              <div className="relative overflow-x-auto border border-neutral-100 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase font-bold text-neutral-400 bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {billingHistory.slice().reverse().map((item: any) => (
                      <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-neutral-600">
                          {format(new Date(item.date), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-neutral-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 font-bold">
                          ${(item.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="secondary" 
                            className={`
                              ${item.status === 'succeeded' ? 'bg-green-50 text-green-700' : ''}
                              ${item.status === 'cancelled' ? 'bg-red-50 text-red-700' : ''}
                              capitalize
                            `}
                          >
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                <History className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">No billing history available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  </ScrollArea>
</div>
  );
}
