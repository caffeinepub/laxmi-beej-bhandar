import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Lock, Save, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

const GREEN = "oklch(0.22 0.06 148)";
const TERRA = "oklch(0.52 0.15 33)";
const GOLD = "oklch(0.72 0.13 80)";

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    storeName: user?.storeName ?? "",
    address: user?.address ?? "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.firstName || !profileForm.storeName) {
      setProfileError("First name and store name are required.");
      return;
    }
    updateProfile(profileForm);
    toast.success("Profile updated!");
    setProfileError("");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 4) {
      setPasswordError("Password must be at least 4 characters.");
      return;
    }
    const ok = changePassword(
      passwordForm.oldPassword,
      passwordForm.newPassword,
    );
    if (!ok) {
      setPasswordError("Old password is incorrect.");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateProfile({ profilePhoto: url });
    toast.success("Profile photo updated!");
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1
          className="font-display font-bold text-2xl"
          style={{ color: GREEN }}
        >
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account and store details
        </p>
      </div>

      {/* Profile Photo */}
      <Card className="shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.profilePhoto} />
                <AvatarFallback
                  className="text-2xl font-bold"
                  style={{ background: GREEN, color: GOLD }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow"
                style={{ background: TERRA }}
                onClick={() => fileRef.current?.click()}
                data-ocid="profile.upload_button"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div>
              <p
                className="font-display font-bold text-lg"
                style={{ color: GREEN }}
              >
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{user?.storeName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.phone}
              </p>
              {user?.address && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.address}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle
            className="text-base font-display flex items-center gap-2"
            style={{ color: GREEN }}
          >
            <User className="w-4 h-4" /> Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>First Name *</Label>
                <Input
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  data-ocid="profile.firstname.input"
                />
              </div>
              <div className="space-y-1">
                <Label>Last Name</Label>
                <Input
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  data-ocid="profile.lastname.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Store Name *</Label>
              <Input
                value={profileForm.storeName}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, storeName: e.target.value }))
                }
                data-ocid="profile.storename.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <Textarea
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="Shop address"
                rows={2}
                data-ocid="profile.address.textarea"
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                value={user?.phone ?? ""}
                readOnly
                className="opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Phone number cannot be changed
              </p>
            </div>
            {profileError && (
              <p
                data-ocid="profile.error_state"
                className="text-sm"
                style={{ color: TERRA }}
              >
                {profileError}
              </p>
            )}
            <Button
              type="submit"
              data-ocid="profile.save.submit_button"
              style={{ background: GREEN, color: "white" }}
            >
              <Save className="w-4 h-4 mr-1" /> Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle
            className="text-base font-display flex items-center gap-2"
            style={{ color: GREEN }}
          >
            <Lock className="w-4 h-4" /> Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-1">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    oldPassword: e.target.value,
                  }))
                }
                data-ocid="profile.old_password.input"
              />
            </div>
            <div className="space-y-1">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    newPassword: e.target.value,
                  }))
                }
                data-ocid="profile.new_password.input"
              />
            </div>
            <div className="space-y-1">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((p) => ({
                    ...p,
                    confirmPassword: e.target.value,
                  }))
                }
                data-ocid="profile.confirm_password.input"
              />
            </div>
            {passwordError && (
              <p
                data-ocid="profile.password.error_state"
                className="text-sm"
                style={{ color: TERRA }}
              >
                {passwordError}
              </p>
            )}
            <Button
              type="submit"
              data-ocid="profile.password.submit_button"
              style={{ background: TERRA, color: "white" }}
            >
              <Lock className="w-4 h-4 mr-1" /> Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
