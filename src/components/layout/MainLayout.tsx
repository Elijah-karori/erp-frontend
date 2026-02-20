import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as TaskIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  HowToReg as HowToRegIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 280;

const MainLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const { user, logout, hasRole, hasPermission } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: ['*'], // All roles
    },
    {
      text: 'Onboarding',
      icon: <HowToRegIcon />,
      path: '/onboarding',
      roles: ['SuperAdmin', 'Admin', 'HRManager'],
      permission: 'hr:write',
    },
    {
      text: 'Employees',
      icon: <PeopleIcon />,
      path: '/employees',
      roles: ['SuperAdmin', 'Admin', 'HRManager', 'ProjectManager'],
      permission: 'hr:read',
    },
    {
      text: 'Tasks',
      icon: <TaskIcon />,
      path: '/tasks',
      roles: ['*'],
      permission: 'task:read',
    },
    {
      text: 'Leave',
      icon: <EventIcon />,
      path: '/leave',
      roles: ['*'],
    },
    {
      text: 'Attendance',
      icon: <EventIcon />,
      path: '/attendance',
      roles: ['*'],
    },
    {
      text: 'Payroll',
      icon: <MoneyIcon />,
      path: '/payroll',
      roles: ['SuperAdmin', 'FinanceManager', 'HRManager'],
      permission: 'payroll:manage',
    },
    {
      text: 'HR Approvals',
      icon: <HowToRegIcon />,
      path: '/hr/approvals',
      roles: ['SuperAdmin', 'HRManager', 'ProjectManager'],
      permission: 'hr:write',
    },
    {
      text: 'Reports',
      icon: <AssessmentIcon />,
      path: '/reports',
      roles: ['SuperAdmin', 'Admin', 'FinanceManager'],
      permission: 'audit:read:all',
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.roles.includes('*')) return true;
    const hasRequiredRole = item.roles.some((role) => hasRole(role));
    if (item.permission) {
      return hasRequiredRole && hasPermission(item.permission.split(':')[0], item.permission.split(':')[1]);
    }
    return hasRequiredRole;
  });

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          ERP System
        </Typography>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && !isMobile && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {filteredMenuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.full_name ? getInitials(user.full_name) : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.875rem' }}>
              {user?.full_name ? getInitials(user.full_name) : 'U'}
            </Avatar>
          </ListItemIcon>
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>

      <Menu
        id="notification-menu"
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <MenuItem>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              New Onboarding Request
            </Typography>
            <Typography variant="caption" color="text.secondary">
              John Doe needs approval
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              5 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              Leave Request Approved
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Your leave request has been approved
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Button size="small" onClick={() => navigate('/notifications')}>
              View All Notifications
            </Button>
          </Box>
        </MenuItem>
      </Menu>

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              ...(open ? {} : { display: 'none' }),
            },
          }}
          open={open}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open && !isMobile ? drawerWidth : 0}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;