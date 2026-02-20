import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

const leaveSchema = z.object({
  leave_type: z.enum(['annual', 'sick', 'maternity', 'paternity', 'compassionate', 'study', 'unpaid']),
  start_date: z.string(),
  end_date: z.string(),
  reason: z.string().min(5, 'Reason must be at least 5 characters'),
  contact_during_leave: z.string().optional(),
  address_during_leave: z.string().optional(),
  handover_notes: z.string().optional(),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveBalance {
  leave_type: string;
  total_entitled: number;
  used: number;
  pending: number;
  available: number;
  carried_forward: number;
}

interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: string;
  created_at: string;
  manager_comments?: string;
  hr_comments?: string;
}

const LeaveRequests: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, balancesRes] = await Promise.all([
        apiClient.get('/hr/leave/requests/me'),
        apiClient.get('/hr/leave/balances/me'),
      ]);
      setRequests(requestsRes.data);
      setBalances(balancesRes.data);
    } catch (error) {
      console.error('Failed to fetch leave data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    // Subtract weekends
    let workingDays = 0;
    for (let i = 0; i < diffDays; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      if (day.getDay() !== 0 && day.getDay() !== 6) {
        workingDays++;
      }
    }
    
    return workingDays;
  };

  const onSubmit = async (data: LeaveFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await apiClient.post('/hr/leave/requests', data);
      await fetchData();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) return;

    try {
      await apiClient.post(`/hr/leave/requests/${requestId}/cancel`, {
        cancellation_reason: 'Cancelled by employee',
      });
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to cancel request');
    }
  };

  const handleOpenDialog = () => {
    reset();
    setError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    reset();
  };

  const handleViewRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'manager_approved':
        return 'info';
      case 'hr_approved':
        return 'info';
      case 'rejected':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getBalanceColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage < 20) return 'error';
    if (percentage < 50) return 'warning';
    return 'success';
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Leave Requests</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Leave Request
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Leave Balances
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {balances.map((balance) => (
          <Card key={balance.leave_type} sx={{ minWidth: 150 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                {balance.leave_type.charAt(0).toUpperCase() + balance.leave_type.slice(1)}
              </Typography>
              <Typography variant="h4" component="div">
                {balance.available}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">Total: {balance.total_entitled}</Typography>
                <Typography variant="caption">Used: {balance.used}</Typography>
              </Box>
              <Chip
                size="small"
                label={`${Math.round((balance.available / balance.total_entitled) * 100)}%`}
                color={getBalanceColor(balance.available, balance.total_entitled)}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      <Typography variant="h6" gutterBottom>
        Request History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  {request.leave_type.charAt(0).toUpperCase() + request.leave_type.slice(1)}
                </TableCell>
                <TableCell>{format(new Date(request.start_date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{format(new Date(request.end_date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{request.total_days}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status.replace('_', ' ')}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{format(new Date(request.created_at), 'dd/MM/yyyy')}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton size="small" onClick={() => handleViewRequest(request)}>
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  {request.status === 'pending' && (
                    <Tooltip title="Cancel">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Request Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>New Leave Request</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Leave Type</InputLabel>
              <Select
                {...register('leave_type')}
                label="Leave Type"
                error={!!errors.leave_type}
                defaultValue="annual"
              >
                <MenuItem value="annual">Annual Leave</MenuItem>
                <MenuItem value="sick">Sick Leave</MenuItem>
                <MenuItem value="maternity">Maternity Leave</MenuItem>
                <MenuItem value="paternity">Paternity Leave</MenuItem>
                <MenuItem value="compassionate">Compassionate Leave</MenuItem>
                <MenuItem value="study">Study Leave</MenuItem>
                <MenuItem value="unpaid">Unpaid Leave</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                {...register('start_date')}
                label="Start Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.start_date}
                helperText={errors.start_date?.message}
              />

              <TextField
                {...register('end_date')}
                label="End Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!errors.end_date}
                helperText={errors.end_date?.message}
              />
            </Box>

            {startDate && endDate && (
              <Alert severity="info" sx={{ mt: 1 }}>
                Total working days: {calculateDays()}
              </Alert>
            )}

            <TextField
              {...register('reason')}
              label="Reason"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              error={!!errors.reason}
              helperText={errors.reason?.message}
            />

            <TextField
              {...register('contact_during_leave')}
              label="Contact During Leave (Optional)"
              fullWidth
              margin="normal"
            />

            <TextField
              {...register('address_during_leave')}
              label="Address During Leave (Optional)"
              fullWidth
              margin="normal"
            />

            <TextField
              {...register('handover_notes')}
              label="Handover Notes (Optional)"
              multiline
              rows={2}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Leave Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Type</Typography>
              <Typography variant="body1" gutterBottom>
                {selectedRequest.leave_type.charAt(0).toUpperCase() + selectedRequest.leave_type.slice(1)}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">Period</Typography>
              <Typography variant="body1" gutterBottom>
                {format(new Date(selectedRequest.start_date), 'dd MMMM yyyy')} -{' '}
                {format(new Date(selectedRequest.end_date), 'dd MMMM yyyy')}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">Total Days</Typography>
              <Typography variant="body1" gutterBottom>
                {selectedRequest.total_days} working days
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">Reason</Typography>
              <Typography variant="body1" paragraph>
                {selectedRequest.reason}
              </Typography>

              {selectedRequest.manager_comments && (
                <>
                  <Typography variant="subtitle2" color="text.secondary">Manager Comments</Typography>
                  <Typography variant="body1" paragraph>
                    {selectedRequest.manager_comments}
                  </Typography>
                </>
              )}

              {selectedRequest.hr_comments && (
                <>
                  <Typography variant="subtitle2" color="text.secondary">HR Comments</Typography>
                  <Typography variant="body1" paragraph>
                    {selectedRequest.hr_comments}
                  </Typography>
                </>
              )}

              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={selectedRequest.status.replace('_', ' ')}
                  color={getStatusColor(selectedRequest.status)}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequests;