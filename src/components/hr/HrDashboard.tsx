import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  HowToReg as HowToRegIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

interface HRDashboardStats {
  total_employees: number;
  active_employees: number;
  pending_onboarding: number;
  pending_leave: number;
  pending_approvals: number;
  payroll_month: number;
  attendance_rate: number;
  employee_growth: number;
}

interface RecentActivity {
  id: number;
  type: 'onboarding' | 'leave' | 'promotion' | 'termination';
  user: {
    id: number;
    full_name: string;
    avatar?: string;
  };
  description: string;
  timestamp: string;
  status?: string;
}

const HRDashboard: React.FC = () => {
  const [stats, setStats] = useState<HRDashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        apiClient.get('/hr/dashboard/stats'),
        apiClient.get('/hr/dashboard/recent-activity'),
      ]);
      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'onboarding':
        return <HowToRegIcon color="primary" />;
      case 'leave':
        return <EventIcon color="warning" />;
      case 'promotion':
        return <TrendingUpIcon color="success" />;
      case 'termination':
        return <TrendingDownIcon color="error" />;
      default:
        return <PeopleIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'onboarding':
        return 'primary';
      case 'leave':
        return 'warning';
      case 'promotion':
        return 'success';
      case 'termination':
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">HR Dashboard</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Employees
                  </Typography>
                  <Typography variant="h3">{stats?.total_employees || 0}</Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    +{stats?.active_employees || 0} active
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Onboarding
                  </Typography>
                  <Typography variant="h3">{stats?.pending_onboarding || 0}</Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Awaiting approval
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <HowToRegIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Leave
                  </Typography>
                  <Typography variant="h3">{stats?.pending_leave || 0}</Typography>
                  <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                    {stats?.pending_approvals || 0} total approvals
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <EventIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Monthly Payroll
                  </Typography>
                  <Typography variant="h3">KSh {stats?.payroll_month?.toLocaleString() || 0}</Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    {stats?.attendance_rate || 0}% attendance
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <AttachMoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ py: 2 }}
            onClick={() => navigate('/onboarding/invite')}
          >
            Invite Employee
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ py: 2 }}
            onClick={() => navigate('/hr/approvals')}
          >
            Review Approvals
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ py: 2 }}
            onClick={() => navigate('/payroll/run')}
          >
            Run Payroll
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ py: 2 }}
            onClick={() => navigate('/reports/hr')}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Recent Activity
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Activity</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: `${getActivityColor(activity.type)}.light`, mr: 2 }}>
                      {getActivityIcon(activity.type)}
                    </Avatar>
                    <Typography variant="body2" fontWeight="500">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={activity.user.avatar}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    >
                      {activity.user.full_name.charAt(0)}
                    </Avatar>
                    {activity.user.full_name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={new Date(activity.timestamp).toLocaleString()}>
                    <Typography variant="body2">
                      {format(new Date(activity.timestamp), 'dd MMM HH:mm')}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (activity.type === 'onboarding') {
                        navigate(`/hr/approvals?id=${activity.id}`);
                      } else if (activity.type === 'leave') {
                        navigate(`/leave/${activity.id}`);
                      }
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HRDashboard;