import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Avatar,
  Grid,
  Divider,
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

interface OnboardingRequest {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  department: string;
  position: string;
  requested_role: string;
  status: string;
  hr_status: string;
  dept_head_status: string;
  created_at: string;
  requested_by: string;
}

const OnboardingApprovals: React.FC = () => {
  const { hasRole } = useAuth();
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<OnboardingRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isHR = hasRole('HRManager') || hasRole('SuperAdmin');
  const isManager = hasRole('ProjectManager') || hasRole('DepartmentHead');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await apiClient.get('/onboarding/pending-approvals');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const endpoint = isHR
        ? `/onboarding/${selectedRequest.id}/hr-${actionType}`
        : `/onboarding/${selectedRequest.id}/dept-${actionType}`;

      await apiClient.post(endpoint, {
        comments: comments,
        ...(actionType === 'reject' && { reason: comments }),
      });

      await fetchRequests();
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.detail || `Failed to ${actionType} request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDialog = (request: OnboardingRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setComments('');
    setError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setActionType(null);
    setComments('');
  };

  const getStatusChip = (request: OnboardingRequest) => {
    if (request.status === 'PENDING') {
      return <Chip label="Awaiting HR" color="warning" size="small" />;
    }
    if (request.status === 'HR_APPROVED') {
      return <Chip label="Awaiting Dept Head" color="info" size="small" />;
    }
    return <Chip label={request.status} color="success" size="small" />;
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Onboarding Approvals
      </Typography>

      {requests.length === 0 ? (
        <Alert severity="info">No pending approvals at this time.</Alert>
      ) : (
        <Grid container spacing={2}>
          {requests.map((request) => (
            <Grid item xs={12} key={request.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{ mr: 2 }}
                        src={`https://ui-avatars.com/api/?name=${request.user.name}&background=2563eb&color=fff`}
                      />
                      <Box>
                        <Typography variant="h6">{request.user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.user.email}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip label={request.position} size="small" />
                          <Chip
                            label={request.requested_role}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {getStatusChip(request)}
                        </Box>
                      </Box>
                    </Box>

                    <Box>
                      {isHR && request.status === 'PENDING' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleOpenDialog(request, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={() => handleOpenDialog(request, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}

                      {isManager && request.status === 'HR_APPROVED' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<ApproveIcon />}
                            onClick={() => handleOpenDialog(request, 'approve')}
                          >
                            Final Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={() => handleOpenDialog(request, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Department: {request.department}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Requested by: {request.requested_by}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(request.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve' : 'Reject'} Onboarding Request
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedRequest.user.name} - {selectedRequest.position}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <TextField
                label={actionType === 'approve' ? 'Comments (optional)' : 'Rejection Reason'}
                multiline
                rows={4}
                fullWidth
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required={actionType === 'reject'}
                error={actionType === 'reject' && !comments}
                helperText={
                  actionType === 'reject' && !comments
                    ? 'Rejection reason is required'
                    : ''
                }
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAction}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            disabled={
              isSubmitting || (actionType === 'reject' && !comments)
            }
          >
            {isSubmitting ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnboardingApprovals;