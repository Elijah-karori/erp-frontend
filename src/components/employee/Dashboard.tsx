import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Button,
  Chip,
} from '@mui/material';
import {
  Work as WorkIcon,
  Event as EventIcon,
  Assignment as TaskIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';

interface DashboardStats {
  pending_tasks: number;
  upcoming_leave: number;
  attendance_rate: number;
  next_payout: number;
}

interface LeaveRequest {
  id: number;
  start_date: string;
  end_date: string;
  leave_type: string;
  status: string;
}

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, leaveRes] = await Promise.all([
        apiClient.get('/employee/dashboard/stats'),
        apiClient.get('/employee/leave/requests/me?limit=5'),
      ]);
      setStats(statsRes.data);
      setLeaveRequests(leaveRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          sx={{ width: 56, height: 56, mr: 2 }}
          src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=2563eb&color=fff`}
        />
        <Box>
          <Typography variant="h4">Welcome back, {user?.full_name}!</Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your work today.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TaskIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Pending Tasks</Typography>
              </Box>
              <Typography variant="h3">{stats?.pending_tasks || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Upcoming Leave</Typography>
              </Box>
              <Typography variant="h3">{stats?.upcoming_leave || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Attendance Rate</Typography>
              </Box>
              <Typography variant="h3">{stats?.attendance_rate || 0}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Next Payout</Typography>
              </Box>
              <Typography variant="h3">KSh {stats?.next_payout || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Leave Requests</Typography>
                <Button size="small" href="/employee/leave">
                  View All
                </Button>
              </Box>

              {leaveRequests.length === 0 ? (
                <Typography color="text.secondary">No leave requests found.</Typography>
              ) : (
                leaveRequests.map((request) => (
                  <Box
                    key={request.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box>
                      <Typography variant="body1">
                        {new Date(request.start_date).toLocaleDateString()} -{' '}
                        {new Date(request.end_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.leave_type}
                      </Typography>
                    </Box>
                    <Chip
                      label={request.status}
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                href="/employee/attendance/check-in"
              >
                Check In / Out
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 1 }}
                href="/employee/leave/new"
              >
                Request Leave
              </Button>

              <Button
                variant="outlined"
                fullWidth
                href="/employee/profile"
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeDashboard;