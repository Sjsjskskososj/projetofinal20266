import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

const BALANCE = 60000;

const WEEK_BARS = [
  { label: "Seg", value: 20 },
  { label: "Ter", value: 36 },
  { label: "Qua", value: 26 },
  { label: "Qui", value: 64 },
  { label: "Sex", value: 30 },
  { label: "Sáb", value: 22 },
  { label: "Dom", value: 28 },
] as const;

const TRANSACTIONS = [
  { name: "Fernandinho", type: "Pix recebido", amount: 1500.0 },
  { name: "Padaria do Seu Zé", type: "Compra no débito", amount: -23.75 },
  { name: "Dona Cida", type: "Transferência enviada", amount: -120.0 },
  { name: "Assinatura do Streaming do Juninho", type: "Assinatura", amount: -39.9 },
] as const;

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Card
        sx={{
          color: "common.white",
          overflow: "hidden",
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(109,65,255,1) 0%, rgba(0,156,255,1) 100%)",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <IconButton aria-label="menu" sx={{ color: "common.white" }}>
              <MenuRoundedIcon />
            </IconButton>
            <Box sx={{ flex: 1 }} />
            <IconButton
              aria-label="notificações"
              sx={{ color: "common.white" }}
            >
              <NotificationsNoneRoundedIcon />
            </IconButton>
          </Stack>

          <Stack spacing={0.5} sx={{ mt: 1.5 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
              Bem-vindo de volta!
            </Typography>
            <Typography sx={{ opacity: 0.9 }} variant="body2">
              Oi, Arthur (mock)
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ alignItems: "flex-end" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Saldo total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>
                  {formatBRL(BALANCE)}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Button
                size="small"
                variant="outlined"
                startIcon={<TrendingUpRoundedIcon />}
                href="/estatisticas"
              >
                Estatísticas
              </Button>
            </Stack>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "flex-end",
                height: 120,
                px: 0.5,
              }}
            >
              {WEEK_BARS.map((b) => (
                <Box
                  key={b.label}
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 18,
                      borderRadius: 2,
                      height: `${b.value}%`,
                      minHeight: 10,
                      bgcolor: b.label === "Qui" ? "primary.main" : "grey.200",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {b.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ArrowUpwardRoundedIcon />}
                href="/enviar"
              >
                Enviar
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowDownwardRoundedIcon />}
                href="/receber"
              >
                Receber
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CreditCardRoundedIcon />}
                href="/cartoes"
              >
                Cartões
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" sx={{ alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontWeight: 900 }}>Histórico recente</Typography>
            <Box sx={{ flex: 1 }} />
            <Button size="small" href="/extrato">
              Ver tudo
            </Button>
          </Stack>

          <Divider sx={{ mb: 1 }} />

          <List disablePadding>
            {TRANSACTIONS.map((t) => {
              const isIn = t.amount >= 0;
              return (
                <ListItem
                  key={t.name}
                  disableGutters
                  secondaryAction={
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: isIn ? "success.main" : "error.main",
                      }}
                    >
                      {isIn ? "+" : ""}
                      {formatBRL(t.amount)}
                    </Typography>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: isIn ? "success.light" : "error.light",
                        color: isIn ? "success.dark" : "error.dark",
                        fontWeight: 900,
                      }}
                    >
                      {isIn ? "ENT" : "SAI"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 800 }}>{t.name}</Typography>
                    }
                    secondary={t.type}
                  />
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
