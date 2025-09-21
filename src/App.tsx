import { Admin, Resource, bwLightTheme, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";

import { UserList, UserEdit, UserCreate } from "./components/User";
import { ActivityList, ActivityEdit } from "./components/Activity";
import { GroupCreate, GroupEdit, GroupList } from "./components/Group";

import { LoginPage } from "./components/LoginPage";
import authProvider from "./lib/authProvider";

import PersonIcon from '@mui/icons-material/Person';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import GroupsIcon from '@mui/icons-material/Groups';

import jsonServerProvider from "ra-data-json-server";
import httpClient from "./lib/httpClient";
import { BASE_API_URL } from "./constants";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Admin
        theme={bwLightTheme}
        dataProvider={jsonServerProvider(
          `${BASE_API_URL}/admin`,
          httpClient,
        )}
        authProvider={authProvider}
        loginPage={LoginPage}
        title="User Management Dashboard"
      >
        <Resource
          name="users"
          list={UserList}
          edit={UserEdit}
          create={UserCreate}
          icon={PersonIcon}
          options={{ label: "Users" }}
        />
        <Resource
          name="activities"
          list={ActivityList}
          edit={ActivityEdit}
          icon={SportsSoccerIcon}
          options={{ label: "Activities" }}
        />
        <Resource
          name="groups"
          list={GroupList}
          edit={GroupEdit}
          create={GroupCreate}
          icon={GroupsIcon}
          options={{ label: "Groups" }}
        />
      </Admin>
    </div>
  );
}

export default App;
