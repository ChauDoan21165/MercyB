import { useNavigate } from 'react-router-dom';
import { useAdminLevel } from '@/hooks/useAdminLevel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Crown, Settings, Users, Eye, Edit, Lock, ArrowLeft } from 'lucide-react';

export default function AdminMyRole() {
  const navigate = useNavigate();
  const { loading, adminInfo, permissions, getLevelLabel, isAdminMaster } = useAdminLevel();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!adminInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You are not registered as an admin in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const levelDescriptions: Record<number, string> = {
    1: 'Basic viewer with minimal access',
    2: 'Junior admin with limited management',
    3: 'Standard admin with moderate access',
    4: 'Senior admin with expanded permissions',
    5: 'Lead admin with team oversight',
    6: 'Manager with broad access',
    7: 'Director with strategic control',
    8: 'Executive with near-full access',
    9: 'System Administrator with full control',
    10: 'Admin Master with absolute authority',
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Role Card */}
        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              {isAdminMaster ? (
                <div className="p-4 bg-yellow-500/10 rounded-full">
                  <Crown className="h-16 w-16 text-yellow-500" />
                </div>
              ) : (
                <div className="p-4 bg-primary/10 rounded-full">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">
              {getLevelLabel(adminInfo.level)}
            </CardTitle>
            <CardDescription className="text-lg">
              {levelDescriptions[adminInfo.level]}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">{adminInfo.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Admin since {new Date(adminInfo.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Permissions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* What You Can Do */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-green-500" />
                What You Can Do
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>View all tiers and rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Access admin dashboard</span>
              </div>
              {permissions.canManageLevels.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">✓</Badge>
                  <span>Manage Level {permissions.canManageLevels.join(', ')} admins</span>
                </div>
              )}
              {permissions.canCreateAdmins && (
                <div className="flex items-center gap-2">
                  <Badge variant="default">✓</Badge>
                  <span>Create new admins</span>
                </div>
              )}
              {permissions.canEditSystem && (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">✓</Badge>
                    <span>Edit rooms and tiers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">✓</Badge>
                    <span>Modify system settings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">✓</Badge>
                    <span>Access all admin tools</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* What You Cannot Do */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-red-500" />
                Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!permissions.canEditSystem && (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">✗</Badge>
                    <span>Edit rooms and tiers (read-only)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">✗</Badge>
                    <span>Modify system settings</span>
                  </div>
                </>
              )}
              {!permissions.canCreateAdmins && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">✗</Badge>
                  <span>Create new admins</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="destructive">✗</Badge>
                <span>View or manage Level {adminInfo.level}+ admins</span>
              </div>
              {!isAdminMaster && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">✗</Badge>
                  <span>Delete or demote Admin Master</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Level Hierarchy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Admin Level Hierarchy
            </CardTitle>
            <CardDescription>
              Higher levels have authority over lower levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((level) => (
                <div 
                  key={level}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    level === adminInfo.level 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : level > adminInfo.level
                        ? 'bg-muted/50 opacity-50'
                        : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {level === 10 && <Crown className="h-4 w-4 text-yellow-500" />}
                    <span className="font-medium">{getLevelLabel(level)}</span>
                    {level === adminInfo.level && (
                      <Badge variant="default" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {level === 10 && 'Full control'}
                    {level === 9 && 'System admin'}
                    {level >= 1 && level <= 8 && (level >= 9 ? 'System access' : 'Read-only system')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {permissions.canEditSystem && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate('/admin/manage-admins')}>
                <Users className="h-4 w-4 mr-2" />
                Manage Admins
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/rooms')}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Rooms
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin/tiers')}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Tiers
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
