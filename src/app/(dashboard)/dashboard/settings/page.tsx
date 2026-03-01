"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Shield,
  AlertTriangle,
} from "lucide-react";

export default function DashboardSettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Profile Section */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-dash-card border-white/[0.06]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value="Mehedi Hasan" disabled className="bg-white/[0.03]" />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input
                  value={session?.user?.email || ""}
                  disabled
                  className="bg-white/[0.03]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Admin</Badge>
              <span className="text-xs text-muted-foreground">
                Credentials managed via environment variables
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-dash-card border-white/[0.06]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="h-4 w-4" /> Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                    toast.success(`Theme set to ${label}`);
                  }}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    theme === value
                      ? "border-violet bg-violet/10"
                      : "border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-dash-card border-white/[0.06]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Authentication is managed via NextAuth.js with JWT strategy.
              Credentials are stored securely in environment variables.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                <span className="text-muted-foreground">Auth Strategy</span>
                <Badge variant="secondary">JWT</Badge>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                <span className="text-muted-foreground">Provider</span>
                <Badge variant="secondary">Credentials</Badge>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                <span className="text-muted-foreground">Session Status</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-dash-card border-red-500/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" /> Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Signing out will end your current session. You&apos;ll need to log in again
              to access the dashboard.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
