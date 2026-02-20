import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '../../hooks/useOnboarding';

const companySchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  admin_email: z.string().email('Invalid email address'),
  admin_full_name: z.string().min(2, 'Full name is required'),
  admin_phone: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().default('Kenya'),
  timezone: z.string().default('Africa/Nairobi'),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanySetupProps {
  onComplete: () => void;
  setCompanyId: (id: number) => void;
}

const CompanySetup: React.FC<CompanySetupProps> = ({ onComplete, setCompanyId }) => {
  const [error, setError] = useState<string | null>(null);
  const { initializeOrganization, isLoading } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      country: 'Kenya',
      timezone: 'Africa/Nairobi',
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setError(null);
    try {
      const result = await initializeOrganization(data);
      setCompanyId(result.company_id);
      onComplete();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to initialize company');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Company Information
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Tell us about your organization to get started.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register('company_name')}
          label="Company Name"
          fullWidth
          margin="normal"
          error={!!errors.company_name}
          helperText={errors.company_name?.message}
          disabled={isLoading}
        />

        <TextField
          {...register('admin_email')}
          label="Admin Email"
          type="email"
          fullWidth
          margin="normal"
          error={!!errors.admin_email}
          helperText={errors.admin_email?.message}
          disabled={isLoading}
        />

        <TextField
          {...register('admin_full_name')}
          label="Admin Full Name"
          fullWidth
          margin="normal"
          error={!!errors.admin_full_name}
          helperText={errors.admin_full_name?.message}
          disabled={isLoading}
        />

        <TextField
          {...register('admin_phone')}
          label="Admin Phone (optional)"
          fullWidth
          margin="normal"
          error={!!errors.admin_phone}
          helperText={errors.admin_phone?.message}
          disabled={isLoading}
        />

        <TextField
          {...register('industry')}
          label="Industry (optional)"
          fullWidth
          margin="normal"
          error={!!errors.industry}
          helperText={errors.industry?.message}
          disabled={isLoading}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            {...register('country')}
            label="Country"
            fullWidth
            margin="normal"
            error={!!errors.country}
            helperText={errors.country?.message}
            disabled={isLoading}
          />

          <TextField
            {...register('timezone')}
            label="Timezone"
            fullWidth
            margin="normal"
            error={!!errors.timezone}
            helperText={errors.timezone?.message}
            disabled={isLoading}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Continue'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CompanySetup;