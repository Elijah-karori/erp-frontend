import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  CheckCircle as CheckInIcon,
  Cancel as CheckOutIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import apiClient from '../../api/client';

interface AttendanceRecord {
  id: number;
  date: string;
  actual_check_in: string | null;
  actual_check_out: string | null;
  hours_worked: number;
  regular_hours: number;
  overtime_hours: number;
  late_minutes: number;
  is_late: boolean;
  left_early: boolean;
  status: string;
  check_in_location: string | null;
}

interface AttendanceSummary {
  total_hours: number;
  regular_hours: number;
  overtime_hours: number;
  late_days: number;
  present_days: number;
  absent_days: number;
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInStatus, setCheckInStatus] = useState<'checked_in' | 'checked_out' | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchAttendance();
    checkCurrentStatus();
    getCurrentLocation();
  }, [startDate, endDate]);

  const fetchAttendance = async () => {
    try {
      const response = await apiClient.get('/hr/attendance/me', {
        params: { start_date: startDate, end_date: endDate },
      });
      setRecords(response.data);
      calculateSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCurrentStatus = async () => {
    try {
      const response = await apiClient.get('/hr/attendance/current-status');
      setCheckInStatus(response.data.status);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const calculateSummary = (records: AttendanceRecord[]) => {
    const summary: AttendanceSummary = {
      total_hours: 0,
      regular_hours: 0,
      overtime_hours: 0,
      late_days: 0,
      present_days: 0,
      absent_days: 0,
    };

    records.forEach((record) => {
      summary.total_hours += record.hours_worked || 0;
      summary.regular_hours += record.regular_hours || 0;
      summary.overtime_hours += record.overtime_hours || 0;
      if (record.is_late) summary.late_days++;
      if (record.status === 'present') summary.present_days++;
      if (record.status === 'absent') summary.absent_days++;
    });

    setSummary(summary);
  };

  const handleCheckIn = async () => {
    setError(null);
    try {
      await apiClient.post('/hr/attendance/check-in', {
        check_in_location: location,
      });
      await fetchAttendance();
      setCheckInStatus('checked_in');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    setError(null);
    try {
      await apiClient.post('/hr/attendance/check-out', {
        check_out_location: location,
      });
      await fetchAttendance();
      setCheckInStatus('checked_out');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to check out');
    }
  };

  const handleThisWeek = () => {
    const start = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const end = format(endOfWeek(new Date()), 'yyyy-MM-dd');
    setStartDate(start);
    setEndDate(end);
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Attendance</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleThisWeek}
          >
            This Week
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => fetchAttendance()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Check In/Out Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Attendance
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {location ? `Location: ${location}` : 'Getting location...'}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }} />

            {checkInStatus === 'checked_in' ? (
              <Button
                variant="contained"
                color="warning"
                startIcon={<CheckOutIcon />}
                onClick={handleCheckOut}
                size="large"
              >
                Check Out
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckInIcon />}
                onClick={handleCheckIn}
                size="large"
              >
                Check In
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Hours
                </Typography>
                <Typography variant="h5">
                  {summary.total_hours.toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Regular Hours
                </Typography>
                <Typography variant="h5">
                  {summary.regular_hours.toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Overtime
                </Typography>
                <Typography variant="h5" color="success.main">
                  {summary.overtime_hours.toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Present Days
                </Typography>
                <Typography variant="h5" color="success.main">
                  {summary.present_days}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Late Days
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {summary.late_days}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Absent Days
                </Typography>
                <Typography variant="h5" color="error.main">
                  {summary.absent_days}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Date Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Box>

      {/* Attendance Records */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Hours Worked</TableCell>
              <TableCell>Regular</TableCell>
              <TableCell>Overtime</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  {record.actual_check_in
                    ? format(new Date(record.actual_check_in), 'HH:mm')
                    : '-'}
                </TableCell>
                <TableCell>
                  {record.actual_check_out
                    ? format(new Date(record.actual_check_out), 'HH:mm')
                    : '-'}
                </TableCell>
                <TableCell>{record.hours_worked?.toFixed(1) || 0}</TableCell>
                <TableCell>{record.regular_hours?.toFixed(1) || 0}</TableCell>
                <TableCell>
                  {record.overtime_hours > 0 && (
                    <Chip
                      label={record.overtime_hours.toFixed(1)}
                      color="success"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {record.is_late && (
                      <Tooltip title={`Late by ${record.late_minutes} minutes`}>
                        <Chip label="Late" color="warning" size="small" />
                      </Tooltip>
                    )}
                    {record.left_early && (
                      <Tooltip title={`Left early by ${record.left_early_minutes} minutes`}>
                        <Chip label="Early" color="info" size="small" />
                      </Tooltip>
                    )}
                    {!record.is_late && !record.left_early && record.status === 'present' && (
                      <Chip label="On Time" color="success" size="small" />
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance;