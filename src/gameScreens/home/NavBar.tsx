import { Link } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
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

export const GithubLink = ({ link }: { link: string }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none", color: "white" }}
    >
      <ListItem key={"github"} disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <GitHubIcon />
          &nbsp; GITHUB
        </ListItemButton>
      </ListItem>
    </a>
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
      <NavLink link={"/hundred"} alt={"100 PLAY"} />
      <ListItem key="gap" disablePadding>
        <ListItemButton sx={{ pl: 4 }} />
      </ListItem>
      <NavLink link={"/auto"} alt={"AUTO PLAY"} />
      <ListItem key="gap2" disablePadding>
        <ListItemButton sx={{ pl: 4 }} />
      </ListItem>
      <NavLink link={"/analysis"} alt={"ANALYSIS"} />
      <NavLink link={"/settings"} alt={"SETTINGS"} />
      <ListItem key="gap3" disablePadding>
        <ListItemButton sx={{ pl: 4 }} />
      </ListItem>
      <NavLink link={"/help"} alt={"HELP"} />
      <GithubLink link={"https://github.com/mfantham/video-poker-simulator"} />
    </div>
  );
};
