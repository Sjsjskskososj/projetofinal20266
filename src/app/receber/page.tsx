import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function ReceberPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack spacing={0.5}>
        <Typography variant="overline" color="text.secondary">
          BankApp
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Receber
        </Typography>
        <Typography color="text.secondary">
          Placeholder (só frontend). Aqui entra a tela de receber dinheiro.
        </Typography>
      </Stack>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography sx={{ fontWeight: 800 }}>Em construção</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

