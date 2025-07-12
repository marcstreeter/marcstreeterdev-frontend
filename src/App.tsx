import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, AppBar, Toolbar, Button as MuiButton,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from './components/ThemeProvider';
import { useTheme } from '@mui/material/styles';
import { Button } from './components/Button';
import { Card } from './components/Card';
import StatusPage from './pages/StatusPage';

function App() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const HomePage = () => (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Marc Streeter Dev Frontend
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Card 
            title="Button Component" 
            subtitle="Custom MUI Button with loading state"
          >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary">
                Primary Button
              </Button>
              <Button variant="outlined" color="secondary">
                Secondary Button
              </Button>
              <Button loading>
                Loading Button
              </Button>
              <Button disabled>
                Disabled Button
              </Button>
            </Box>
          </Card>
          <Card 
            title="Counter Example" 
            subtitle="Interactive component demonstration"
          >
            <Typography variant="h4" gutterBottom>
              Count: {count}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={() => setCount(count + 1)}
              >
                Increment
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setCount(count - 1)}
              >
                Decrement
              </Button>
              <Button 
                variant="text" 
                onClick={() => setCount(0)}
              >
                Reset
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Container>
  );

  return (
    <ThemeProvider>
      <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
        <AppBar position="static" elevation={0} sx={{ width: '100vw', left: 0 }}>
          <Toolbar sx={{ minHeight: 48 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Marc Streeter Dev
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  edge="end"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                >
                  <List sx={{ width: 200 }}>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNav('/')}> <ListItemText primary="Home" /> </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => handleNav('/status')}> <ListItemText primary="API Status" /> </ListItemButton>
                    </ListItem>
                  </List>
                </Drawer>
              </>
            ) : (
              <>
                <MuiButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
                  Home
                </MuiButton>
                <MuiButton color="inherit" onClick={() => navigate('/status')}>
                  API Status
                </MuiButton>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Box>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/status" element={<Container maxWidth="md" sx={{ mt: 2 }}><StatusPage /></Container>} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
