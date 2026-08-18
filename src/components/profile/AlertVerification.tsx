import { Terminal } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

export function AlertVerification() {
  const { theme } = useTheme();

  return (
<Alert variant={theme === 'dark' ? "default" : "destructive"}>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Verification Pending!</AlertTitle>
      <AlertDescription>
        Check your email and complete the verification process.
      </AlertDescription>
    </Alert>
  );
}
