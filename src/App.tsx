import { Admin, Resource, bwLightTheme } from "react-admin";
import { UserList } from "./components/UserList";
import { UserEdit } from "./components/UserEdit";
import { LoginPage } from "./components/LoginPage";
import authProvider from "./lib/authProvider";

import UserIcon from "@mui/icons-material/People";
import jsonServerProvider from "ra-data-json-server";
import httpClient from "./lib/httpClient";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Admin
        theme={bwLightTheme}
        dataProvider={jsonServerProvider(
          "http://localhost:8080/admin",
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
          icon={UserIcon}
          options={{ label: "Users" }}
        />
      </Admin>
    </div>
  );
}

export default App;
