import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as DownloadIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import apiClient from '../../api/client';

interface PayrollRun {
  id: number;
  period: string;
  month: string;
  year: number;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  total_employees: number;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  processed_by?: string;
  processed_at?: string;
}

interface EmployeePayout {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  department: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_pay: number;
  bank_account: string;
  status: 'pending' | 'approved' | 'paid' | 'failed';
}

const Payroll: React.FC = () => {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [currentPayouts, setCurrentPayouts] = useState<EmployeePayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [runData, setRunData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = ['Review Period', 'Calculate Payroll', 'Review Results', 'Approve & Process'];

  useEffect(() => {
    fetchPayrollRuns();
  }, []);

  useEffect(() => {
    if (selectedPeriod) {
      fetchPayouts(selectedPeriod);
    }
  }, [selectedPeriod]);

  const fetchPayrollRuns = async () => {
    try {
      const response = await apiClient.get('/payroll/runs');
      setPayrollRuns(response.data);
      if (response.data.length > 0) {
        setSelectedPeriod(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch payroll runs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayouts = async (runId: string) => {
    try {
      const response = await apiClient.get(`/payroll/runs/${runId}/payouts`);
      setCurrentPayouts(response.data);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    }
  };

  const handleRunPayroll = async () => {
    setActiveStep(1);
    try {
      // Step 1: Calculate payroll
      const calculateRes = await apiClient.post('/payroll/calculate', {
        period: runData.period,
        month: runData.month,
        year: runData.year,
      });
      setRunData(calculateRes.data);
      setActiveStep(2);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to calculate payroll');
    }
  };

  const handleApprovePayroll = async () => {
    try {
      await apiClient.post(`/payroll/runs/${runData.id}/approve`);
      setActiveStep(3);
      await fetchPayrollRuns();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to approve payroll');
    }
  };

  const handleProcessPayments = async () => {
    try {
      await apiClient.post(`/payroll/runs/${runData.id}/process`);
      setActiveStep(4);
      await fetchPayrollRuns();
      setRunDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to process payments');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'info';
      case 'draft':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'approved':
        return 'info';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredPayouts = currentPayouts.filter((payout) => {
    const matchesSearch = payout.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payroll Management</Typography>
        <Button
          variant="contained"
          startIcon={<MoneyIcon />}
          onClick={() => setRunDialogOpen(true)}
        >
          Run Payroll
        </Button>
      </Box>

      {/* Payroll Periods */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payroll Periods
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell>Month</TableCell>
                      <TableCell>Employees</TableCell>
                      <TableCell>Gross Pay</TableCell>
                      <TableCell>Net Pay</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Processed</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payrollRuns.map((run) => (
                      <TableRow
                        key={run.id}
                        hover
                        selected={selectedPeriod === run.id.toString()}
                        onClick={() => setSelectedPeriod(run.id.toString())}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{run.period}</TableCell>
                        <TableCell>{run.month} {run.year}</TableCell>
                        <TableCell>{run.total_employees}</TableCell>
                        <TableCell>KSh {run.total_gross.toLocaleString()}</TableCell>
                        <TableCell>KSh {run.total_net.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={run.status}
                            size="small"
                            color={getStatusColor(run.status)}
                          />
                        </TableCell>
                        <TableCell>
                          {run.processed_at ? format(new Date(run.processed_at), 'dd/MM/yyyy') : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download Report">
                            <IconButton size="small">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Employee Payouts */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Employee Payouts
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Base Salary</TableCell>
                  <TableCell align="right">Allowances</TableCell>
                  <TableCell align="right">Deductions</TableCell>
                  <TableCell align="right">Net Pay</TableCell>
                  <TableCell>Bank Account</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.employee_name}</TableCell>
                    <TableCell>{payout.employee_code}</TableCell>
                    <TableCell>{payout.department}</TableCell>
                    <TableCell align="right">KSh {payout.base_salary.toLocaleString()}</TableCell>
                    <TableCell align="right">KSh {payout.allowances.toLocaleString()}</TableCell>
                    <TableCell align="right">KSh {payout.deductions.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="600">
                        KSh {payout.net_pay.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{payout.bank_account}</TableCell>
                    <TableCell>
                      <Chip
                        label={payout.status}
                        size="small"
                        color={getPayoutStatusColor(payout.status)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Run Payroll Dialog */}
      <Dialog open={runDialogOpen} onClose={() => setRunDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Run Payroll</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ my: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Payroll Period
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={runData?.month || ''}
                      onChange={(e) => setRunData({ ...runData, month: e.target.value })}
                      label="Month"
                    >
                      <MenuItem value="January">January</MenuItem>
                      <MenuItem value="February">February</MenuItem>
                      <MenuItem value="March">March</MenuItem>
                      <MenuItem value="April">April</MenuItem>
                      <MenuItem value="May">May</MenuItem>
                      <MenuItem value="June">June</MenuItem>
                      <MenuItem value="July">July</MenuItem>
                      <MenuItem value="August">August</MenuItem>
                      <MenuItem value="September">September</MenuItem>
                      <MenuItem value="October">October</MenuItem>
                      <MenuItem value="November">November</MenuItem>
                      <MenuItem value="December">December</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Year"
                    type="number"
                    value={runData?.year || new Date().getFullYear()}
                    onChange={(e) => setRunData({ ...runData, year: parseInt(e.target.value) })}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && runData && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payroll Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Total Employees</Typography>
                  <Typography variant="h6">{runData.total_employees}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Total Gross Pay</Typography>
                  <Typography variant="h6">KSh {runData.total_gross.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Total Deductions</Typography>
                  <Typography variant="h6">KSh {runData.total_deductions.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Total Net Pay</Typography>
                  <Typography variant="h6" color="success.main">
                    KSh {runData.total_net.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 3 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Payroll has been approved! You can now process payments.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRunDialogOpen(false)}>Cancel</Button>
          {activeStep === 0 && (
            <Button
              onClick={handleRunPayroll}
              variant="contained"
              disabled={!runData?.month || !runData?.year}
            >
              Calculate Payroll
            </Button>
          )}
          {activeStep === 2 && (
            <Button onClick={handleApprovePayroll} variant="contained" color="success">
              Approve Payroll
            </Button>
          )}
          {activeStep === 3 && (
            <Button onClick={handleProcessPayments} variant="contained">
              Process Payments
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll;