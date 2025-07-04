import CircularProgress from "@mui/material/CircularProgress";
import Page from "../layout/Page";

const Loader = () => {
  return (
    <Page>
      <CircularProgress sx={{ margin: "auto" }} />
    </Page>
  );
};

export default Loader;
