import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import heroImage from '@/assets/hero-image.jpg';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-80" />
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-6">
              Transform Your Documents with AI
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Upload, process, and chat with your documents using advanced OCR and AI technology.
            </p>
            <div className="grid grid-cols-2 gap-6 text-left">
              <div className="space-y-2">
                <h3 className="font-semibold">Smart OCR</h3>
                <p className="text-sm opacity-80">
                  Extract text from PDFs and images with high accuracy
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">AI Enhancement</h3>
                <p className="text-sm opacity-80">
                  Beautify and format your text using Gemini AI
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Interactive Chat</h3>
                <p className="text-sm opacity-80">
                  Ask questions about your processed documents
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Secure Storage</h3>
                <p className="text-sm opacity-80">
                  Access your files anytime with secure cloud storage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-subtle">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              DocumentAI
            </h1>
            <p className="text-muted-foreground">
              Transform your documents with AI
            </p>
          </div>
          
          {isLogin ? (
            <LoginForm onToggleMode={toggleMode} />
          ) : (
            <SignupForm onToggleMode={toggleMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;