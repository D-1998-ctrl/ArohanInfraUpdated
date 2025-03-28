import React from "react";
import { Box, Grid, Paper, Typography, Container } from "@mui/material";

const InsightsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom mb={3}>
          Insights
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} p={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Metric 1
              </Typography>
              <Typography variant="body1">Some detailed information about Metric 1.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} p={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Metric 1
              </Typography>
              <Typography variant="body1">Some detailed information about Metric 1.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} p={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Metric 2
              </Typography>
              <Typography variant="body1">Some detailed information about Metric 2.</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} p={3}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Metric 3
              </Typography>
              <Typography variant="body1">Some detailed information about Metric 3.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
export default InsightsPage;