import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import SessionTimeout from './SessionTimeout';

interface SessionManagerProps {
  children: React.ReactNode;
  timeout?: number; // in minutes
  warningTime?: number; // in minutes
}

const SessionManager: React.FC<SessionManagerProps> = ({
  children,
  timeout = 30,
  warningTime = 5
}) => {
  const { signOut } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  const handleTimeout = () => {
    signOut();
  };

  const handleExtendSession = () => {
    // Reset session timer
    setShowWarning(false);
  };

  return (
    <>
      {children}
      <SessionTimeout
        timeout={timeout}
        warningTime={warningTime}
        onTimeout={handleTimeout}
        onExtend={handleExtendSession}
      />
    </>
  );
};

export default SessionManager;