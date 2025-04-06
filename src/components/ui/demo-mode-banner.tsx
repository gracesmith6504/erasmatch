
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DemoModeBanner() {
  return (
    <Alert className="bg-yellow-50 border-yellow-200 mb-4">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>Demo Mode:</strong> This is a frontend prototype. For real authentication, database storage, and messaging, connect this app to Supabase.
      </AlertDescription>
    </Alert>
  );
}
