"use client";

import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#005CAA" },
    secondary: { main: "#FFB300" },
    background: { default: "#F6F7FB" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

