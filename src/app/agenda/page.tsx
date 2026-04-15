import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const ITEMS = [
  {
    title: "Aula Next.js (Frontend)",
    when: "Hoje • 19:30",
    place: "Lab 03",
    tag: "Aula",
  },
  {
    title: "Revisão React MUI",
    when: "Amanhã • 08:00",
    place: "Online",
    tag: "Estudo",
  },
  {
    title: "Entrega Projeto Final",
    when: "Sex • 18:00",
    place: "GitHub",
    tag: "Entrega",
  },
] as const;

export default function AgendaPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          SENAI • Agenda
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Agenda
        </Typography>
        <Typography color="text.secondary">
          Itens abaixo são mock (somente frontend).
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          <Stack divider={<Divider flexItem />} spacing={2}>
            {ITEMS.map((item) => (
              <Stack
                key={item.title}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                }}
              >
                <Stack spacing={0.25}>
                  <Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.when} • {item.place}
                  </Typography>
                </Stack>
                <Chip label={item.tag} color="primary" variant="outlined" />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

