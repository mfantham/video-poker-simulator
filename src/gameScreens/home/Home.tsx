import { useCallback, useState } from "react";
import { AppBar, Box, Drawer, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavBar } from "./NavBar";
import { GameSelection } from "./GameSelection";
import { AppbarContents } from "./AppbarContents";
import { DRAWER_WIDTH } from "./LayoutConstants";
import { AppBarTitleHolder } from "./AppBarTitle";

export const Home = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((s) => !s);
  }, []);

  // @ts-ignore
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(166deg, rgb(0, 63, 139), rgb(0 41 91))",
        }}
      >
        <Toolbar
          sx={{
            margin: { sm: "auto" },
            paddingLeft: { sm: `${DRAWER_WIDTH}px` },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
            }}
          >
            <MenuIcon />
          </IconButton>
          <AppBarTitleHolder>
            <AppbarContents />
          </AppBarTitleHolder>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          container={window.document.body}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              background: "none",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <NavBar />
        </Drawer>
        {/* Desktop version */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              background: "none",
            },
          }}
          open
        >
          <NavBar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          position: "fixed",
          inset: "64px 0 0 0",
          left: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar />
        <GameSelection />
      </Box>
    </Box>
  );
};
