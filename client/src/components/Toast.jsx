import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="toast-container">
      <div className={`toast ${isSuccess ? 'toast-success' : isError ? 'toast-error' : 'toast-warning'}`}>
        {isSuccess && <CheckCircle2 size={20} color="var(--success)" />}
        {isError && <AlertCircle size={20} color="var(--danger)" />}
        {!isSuccess && !isError && <Info size={20} color="var(--warning)" />}
        
        <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
          {toast.message}
        </div>
      </div>
    </div>
  );
};

export default Toast;
