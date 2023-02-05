import { Link } from "react-router-dom";
import { CssBaseline, ListItem, ListItemButton, Toolbar } from "@mui/material";

const NavLink = ({ link, alt }: { link: string; alt: string }) => {
  return (
    <Link to={link} style={{ textDecoration: "none", color: "white" }}>
      <ListItem key={"single"} disablePadding>
        <ListItemButton sx={{ pl: 4 }}>{alt}</ListItemButton>
      </ListItem>
    </Link>
  );
};

export const NavBar = () => {
  return (
    <div>
      <CssBaseline />
      <Toolbar />
      <NavLink link={"/single"} alt={"SINGLE PLAY"} />
      <NavLink link={"/triple"} alt={"TRIPLE PLAY"} />
      <NavLink link={"/five"} alt={"FIVE PLAY"} />
      <NavLink link={"/ten"} alt={"TEN PLAY"} />
      <ListItem key="gap" disablePadding>
        <ListItemButton sx={{ pl: 4 }} />
      </ListItem>
      <NavLink link={"/auto"} alt={"AUTO PLAY"} />
      <ListItem key="gap" disablePadding>
        <ListItemButton sx={{ pl: 4 }} />
      </ListItem>
      <NavLink link={"/analysis"} alt={"ANALYSIS"} />
      <NavLink link={"/settings"} alt={"SETTINGS"} />
    </div>
  );
};
