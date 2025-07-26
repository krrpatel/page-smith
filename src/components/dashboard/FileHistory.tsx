import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { History, Download, FileText, Calendar, Trash2 } from 'lucide-react';

interface ProcessedFile {
  id: string;
  name: string;
  originalName: string;
  processedAt: Date;
  fileSize: number;
  downloadUrl: string;
  status: 'completed' | 'processing' | 'failed';
}

const FileHistory: React.FC = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFileHistory();
  }, []);

  const fetchFileHistory = async () => {
    setLoading(true);
    try {
      // Replace with your Flask API endpoint
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFiles(data.files.map((file: any) => ({
          ...file,
          processedAt: new Date(file.processedAt),
        })));
      }
    } catch (error) {
      console.error('Error fetching file history:', error);
      toast({
        title: "Error loading files",
        description: "Failed to load your file history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file: ProcessedFile) => {
    window.open(file.downloadUrl, '_blank');
  };

  const handleDelete = async (fileId: string) => {
    try {
      // Replace with your Flask API endpoint
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setFiles(files.filter(file => file.id !== fileId));
        toast({
          title: "File deleted",
          description: "The file has been removed from your history.",
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the file.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: ProcessedFile['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          File History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No processed files yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload and process your first document to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <h4 className="font-medium text-sm truncate">
                        {file.name}
                      </h4>
                      <Badge className={`${getStatusColor(file.status)} text-xs`}>
                        {file.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {file.processedAt.toLocaleDateString()}
                      </span>
                      <span>{formatFileSize(file.fileSize)}</span>
                      <span className="truncate">Original: {file.originalName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {file.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file)}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file.id)}
                      className="text-destructive hover:text-destructive text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileHistory;