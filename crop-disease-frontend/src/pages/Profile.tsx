import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        setUser(session.user);
        setFormData({
          full_name: session.user.user_metadata.full_name || "",
          email: session.user.email || "",
        });
      } else {
        navigate("/auth");
      }
    };
    getSession();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: formData.full_name },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setUser(data.user);
      toast.success("Profile updated successfully");
    }
    setIsEditing(false);
  };

  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-b from-muted/30 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="mt-2 text-muted-foreground">
                Manage your account information
              </p>
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>View and edit your profile information</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="gap-2"
                  >
                    <User className="h-4 w-4" />
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </Label>
                    <Input
                      value={user ? new Date(user.created_at).toLocaleDateString() : ""}
                      disabled
                    />
                  </div>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Detection History</CardTitle>
                <CardDescription>Your recent crop disease detections</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-sm text-muted-foreground py-8">
                  No detection history yet. Start by uploading a crop image!
                </p>
                <Button onClick={() => navigate("/detection")} className="w-full">
                  Detect Disease Now
                </Button>
              </CardContent>
            </Card>
            
            <Button variant="destructive" onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                toast.error(error.message);
              } else {
                toast.success("Logged out successfully");
                navigate("/");
              }
            }} className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
