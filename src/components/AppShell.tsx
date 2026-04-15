"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const NAV = [
  { label: "Início", href: "/", icon: <HomeRoundedIcon /> },
  { label: "Estatísticas", href: "/estatisticas", icon: <BarChartRoundedIcon /> },
  { label: "Enviar", href: "/enviar", icon: <SendRoundedIcon /> },
  { label: "Cartões", href: "/cartoes", icon: <CreditCardRoundedIcon /> },
  { label: "Perfil", href: "/perfil", icon: <PersonRoundedIcon /> },
] as const;

function getTabValue(pathname: string) {
  const match = NAV.find((n) =>
    n.href === "/" ? pathname === "/" : pathname.startsWith(n.href),
  );
  return match?.href ?? false;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const value = getTabValue(pathname);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Toolbar sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: { xs: 0, sm: 2 },
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, letterSpacing: 0.2 }}
            >
              BankApp
            </Typography>

            <Tabs
              value={value}
              textColor="primary"
              indicatorColor="primary"
              sx={{ minHeight: 44 }}
            >
              {NAV.map((item) => (
                <Tab
                  key={item.href}
                  value={item.href}
                  label={item.label}
                  component={Link}
                  href={item.href}
                  sx={{ minHeight: 44, fontWeight: 700 }}
                />
              ))}
            </Tabs>
          </Container>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 3, sm: 5 },
          pb: { xs: 10, sm: 5 },
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>

      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          display: { xs: "block", sm: "none" },
        }}
      >
        <BottomNavigation showLabels value={value}>
          {NAV.map((item) => (
            <BottomNavigationAction
              key={item.href}
              label={item.label}
              value={item.href}
              icon={item.icon}
              component={Link}
              href={item.href}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

