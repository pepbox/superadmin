import { useState } from "react";
import Page from "../components/layout/Page";
import DashboardHeader from "../features/dashboard/components/DashboardHeader";
import DashboardMain from "../features/dashboard/components/DashboardMain";

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Page>
      <DashboardHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <DashboardMain searchQuery={searchQuery} />
    </Page>
  );
};

export default DashboardPage;
