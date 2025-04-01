import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem as MuiListItem, // Explicitly import with alias
  ListItemIcon, 
  ListItemText, 
  Box, 
  Container,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Home as HomeIcon, 
  Work as WorkIcon, 
  AddCircle as AddIcon, 
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  ArrowDropDown as DropdownIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';

// Navigation Item Interface
interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

// Main Navigation Component
export const MainNavigation: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Profile menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(anchorEl);

  // Navigation items
  const navItems: NavItem[] = [
    { 
      label: 'Home', 
      icon: <HomeIcon />, 
      path: '/' 
    },
    { 
      label: 'Job Applications', 
      icon: <WorkIcon />, 
      path: '/trackers' 
    },
    { 
      label: 'Create Application', 
      icon: <AddIcon />, 
      path: '/trackers/new' 
    }
  ];

  // Handlers
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleDrawerToggle(); // Close drawer on mobile
  };

  // Mobile drawer content
  const drawer = (
    <List>
      {navItems.map((item) => (
        <MuiListItem 
          key={item.label} 
          onClick={() => handleNavigation(item.path)}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </MuiListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Title */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            Job Application Tracker
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box>
            <Button
              color="inherit"
              endIcon={<DropdownIcon />}
              onClick={handleProfileMenuOpen}
            >
              Gerardo Oliveto
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={profileMenuOpen}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <ProfileIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 240 
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

// Layout Component
export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MainNavigation />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 3,
          backgroundColor: (theme) => theme.palette.background.default
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default MainNavigation;