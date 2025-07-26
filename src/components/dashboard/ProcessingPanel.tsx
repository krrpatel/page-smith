import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Download, Loader2, FileText, Sparkles } from 'lucide-react';

interface ProcessingPanelProps {
  selectedFile: File | null;
}

const ProcessingPanel: React.FC<ProcessingPanelProps> = ({ selectedFile }) => {
  const [beautifyText, setBeautifyText] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string>('');
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file before processing.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    setDownloadUrl(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('beautify', beautifyText.toString());

      // Replace with your Flask API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        setDownloadUrl(result.download_url);
        setProcessedFileName(result.filename);
        
        toast({
          title: "Processing complete!",
          description: "Your document has been processed successfully.",
        });
      } else {
        throw new Error('Processing failed');
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Process Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="beautify"
              checked={beautifyText}
              onCheckedChange={(checked) => setBeautifyText(checked as boolean)}
            />
            <label
              htmlFor="beautify"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Beautify text with AI
            </label>
          </div>
          <p className="text-xs text-muted-foreground ml-6">
            {beautifyText 
              ? "AI will clean and format the extracted text for better readability"
              : "Extract text as-is without AI enhancement"
            }
          </p>
        </div>

        {processing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-medium">Processing document...</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {progress < 30 ? "Extracting text..." : 
               progress < 70 ? "Processing with OCR..." :
               progress < 90 ? "Beautifying with AI..." : "Finalizing..."}
            </p>
          </div>
        )}

        {downloadUrl && (
          <div className="space-y-3 p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-success" />
              <span className="font-medium text-success">Processing Complete!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your document has been processed and is ready for download.
            </p>
            <Button
              onClick={handleDownload}
              className="w-full bg-success hover:bg-success/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Processed Document
            </Button>
          </div>
        )}

        <Button
          onClick={handleProcess}
          disabled={!selectedFile || processing}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Start Processing
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProcessingPanel;