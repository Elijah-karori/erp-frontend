import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, TextField, Link } from '@mui/material';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  isLoading,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const handleResend = async () => {
    await onResend();
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body1" gutterBottom>
        We've sent a verification code to
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {email}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', my: 4 }}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                width: '3rem',
                height: '3rem',
                padding: 0,
              },
            }}
            disabled={isLoading}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleVerify}
        disabled={otp.join('').length !== 6 || isLoading}
        sx={{ mb: 2 }}
      >
        Verify
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {timer > 0 ? `Resend code in ${timer}s` : 'Didn\'t receive code?'}
        </Typography>
        {canResend && (
          <Link
            component="button"
            variant="body2"
            onClick={handleResend}
            disabled={isLoading}
          >
            Resend
          </Link>
        )}
      </Box>
    </Box>
  );
};

export default OTPVerification;