import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Copy, CheckCircle } from 'lucide-react';

interface MFASetupProps {
  secretKey: string;
  qrCodeUrl: string;
  onVerify: (code: string) => Promise<boolean>;
}

const MFASetup: React.FC<MFASetupProps> = ({
  secretKey,
  qrCodeUrl,
  onVerify
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');

    try {
      const success = await onVerify(verificationCode);
      if (!success) {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Set Up Two-Factor Authentication</h2>
        <p className="text-gray-600">
          Enhance your account security by setting up two-factor authentication.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">1. Scan QR Code</h3>
          <p className="text-gray-600 mb-4">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.).
          </p>
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">2. Manual Setup</h3>
          <p className="text-gray-600 mb-4">
            If you can't scan the QR code, manually enter this secret key in your authenticator app:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <code className="text-sm font-mono">{secretKey}</code>
            <button
              onClick={handleCopyKey}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">3. Verify Setup</h3>
          <p className="text-gray-600 mb-4">
            Enter the 6-digit code from your authenticator app to verify the setup:
          </p>
          <div className="space-y-4">
            <input
              type="text"
              maxLength={6}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm"
              >
                {error}
              </motion.p>
            )}
            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || isVerifying}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Verify and Enable 2FA'}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Important:</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
            <li>Store your backup codes in a safe place</li>
            <li>You'll need these codes if you lose access to your authenticator app</li>
            <li>Each backup code can only be used once</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MFASetup;