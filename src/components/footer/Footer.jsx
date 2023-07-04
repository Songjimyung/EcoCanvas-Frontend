import * as React from "react";
import "./footer.css";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[100],
        color: "rgb(40, 84, 48)",
        p: 4,
        bottom: 0,
        boxShadow: "rgb(0 0 0 / 7%) 0px 0px 6px 3px",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              안녕하세요! 저희 사이트는 사용자들에게 최고의 환경 캠페인을
              <br />
              제공하고 친환경 제품 사용 장려를 위해 전념하는 사이트입니다!
              <br />
              Hi! We are EcoCanvas, dedicated to providing the best
              environmental campaigns to our customers.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: contact@ecocanvas.net
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Link href="https://www.facebook.com/mevpr" color="primary">
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/ministry_environment/"
              color="primary"
              sx={{ pl: 1, pr: 1 }}
            >
              <Instagram />
            </Link>
            <Link href="https://twitter.com/mevpr" color="primary">
              <Twitter />
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://www.ecocanvas.net/">
              EcoCanvas
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
