import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#1a1a1a', paper: '#242424' }
  },
  components: { MuiDataGrid: { styleOverrides: { root: { border: 'none' } } } }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}><CssBaseline /><App /></ThemeProvider>
  </React.StrictMode>,
);
