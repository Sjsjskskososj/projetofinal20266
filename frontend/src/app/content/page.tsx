import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

const CONTENT = [
  {
    title: "Introdução ao Next.js (App Router)",
    level: "Básico",
    minutes: 25,
  },
  {
    title: "Componentes com React MUI",
    level: "Intermediário",
    minutes: 35,
  },
  {
    title: "Layouts, Rotas e Navegação",
    level: "Básico",
    minutes: 20,
  },
  {
    title: "Boas práticas de UI",
    level: "Intermediário",
    minutes: 30,
  },
] as const;

export default function ConteudoPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Stack spacing={1}>
        <Typography variant="overline" color="text.secondary">
          SENAI • Conteúdo
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
          Conteúdo
        </Typography>
        <Typography color="text.secondary">
          Cards abaixo são mock (somente frontend).
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {CONTENT.map((c) => (
          <Grid key={c.title} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardActionArea sx={{ height: "100%" }}>
                <CardContent>
                  <Stack spacing={1.25}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <SchoolRoundedIcon color="primary" fontSize="small" />
                      <Typography sx={{ fontWeight: 900 }}>{c.title}</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Chip size="small" label={c.level} variant="outlined" />
                      <Typography variant="body2" color="text.secondary">
                        {c.minutes} min
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

