"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { changePasswordAction, type SettingsState } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(changePasswordAction, null);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <Label htmlFor="currentPassword" required>Current Password</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="newPassword" required>New Password</Label>
        <Input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="confirmPassword" required>Confirm New Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="mt-1.5" />
      </div>

      {state?.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p role="status" className="text-sm text-emerald-600">{state.success}</p>}

      <Button type="submit" disabled={pending} variant="dark">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Update Password
      </Button>
    </form>
  );
}
