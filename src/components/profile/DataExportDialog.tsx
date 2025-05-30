
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Download, FileText, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DataExportDialogProps {
  userId: string | null;
}

type ExportFormat = "json" | "csv";

export const DataExportDialog = ({ userId }: DataExportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");

  const handleExportData = async () => {
    if (!userId) {
      toast.error("Unable to export data. User ID not found.");
      return;
    }

    try {
      setIsExporting(true);

      // Call the edge function to export user data
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { 
          userId,
          format: exportFormat 
        }
      });

      if (error) throw error;

      // Create and download the file
      const blob = new Blob([data.content], { 
        type: exportFormat === "json" ? "application/json" : "text/csv" 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `erasmatch-data-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Your data has been exported as ${exportFormat.toUpperCase()}`);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error exporting data:", error);
      toast.error(`Failed to export data: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          <Download className="mr-2 h-4 w-4" />
          Download My Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" />
            Export Your Data
          </DialogTitle>
          <DialogDescription>
            Download all your personal data from ErasMatch in compliance with GDPR Article 20 (Right to Data Portability).
            This includes your profile information, messages, and activity data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Export Format</Label>
            <RadioGroup 
              value={exportFormat} 
              onValueChange={(value) => setExportFormat(value as ExportFormat)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  JSON (Structured data format)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  CSV (Spreadsheet format)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Data Included:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Profile information (name, email, university, etc.)</li>
              <li>• Direct messages sent and received</li>
              <li>• City chat messages</li>
              <li>• University group messages</li>
              <li>• Account creation and consent dates</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExportData}
              disabled={isExporting}
              className="bg-erasmatch-blue hover:bg-erasmatch-blue/90"
            >
              {isExporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
