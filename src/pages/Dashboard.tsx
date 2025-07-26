import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/ui/auth-context';
import FileUpload from '@/components/dashboard/FileUpload';
import ProcessingPanel from '@/components/dashboard/ProcessingPanel';
import ChatPanel from '@/components/dashboard/ChatPanel';
import FileHistory from '@/components/dashboard/FileHistory';
import { LogOut, Upload, Wand2, MessageCircle, History, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Mock data for processed files - replace with actual data from your API
  const processedFiles = [
    {
      id: '1',
      name: 'Research Paper Analysis.pdf',
      processedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Meeting Notes Summary.pdf',
      processedAt: new Date('2024-01-14'),
    },
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DA</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                DocumentAI
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {user?.name || user?.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome back, {user?.name || 'there'}! 👋
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ready to process some documents? Upload your files, let our AI enhance them, 
              and start chatting with your content. Your document processing workspace is ready to go!
            </p>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md mx-auto bg-card shadow-soft">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Process
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FileUpload onFileSelect={handleFileSelect} />
              <div className="space-y-4">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle className="text-lg">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <p>Upload your PDF, JPG, or PNG document (max 10MB)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <p>Choose whether to enhance text with AI beautification</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <p>Process your document and download the cleaned PDF</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <p>Chat with AI about your processed documents</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="process">
            <div className="max-w-2xl mx-auto">
              <ProcessingPanel selectedFile={selectedFile} />
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <ChatPanel processedFiles={processedFiles} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-4xl mx-auto">
              <FileHistory />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;