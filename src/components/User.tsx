import {
  List,
  Datagrid,
  TextField,
  EmailField,
  NumberField,
  BooleanField,
  SearchInput,
  BooleanInput,
  TopToolbar,
  FilterButton,
  useRecordContext,
  Button,
  ExportButton,
  CreateButton,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  required,
  email,
} from "react-admin";
import { useState } from "react";
import { UserModal } from "./UserModal";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const userFilters = [
  <SearchInput
    source="name"
    placeholder="Search by name"
    alwaysOn
    key="search"
  />,
  <SearchInput
    source="email"
    placeholder="Search by email"
    alwaysOn
    key="search-email"
  />,
  <BooleanInput
    source="email_validated"
    label="Email Validated"
    key="email_validated"
  />,
];

const UserRowButton = () => {
  const record = useRecordContext();
  const [modalOpen, setModalOpen] = useState(false);

  if (!record) return null;

  return (
    <>
      <Button
        label="Actions"
        onClick={() => setModalOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md text-sm"
      />
      <UserModal
        user={record}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

const UserListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
    <CreateButton />
  </TopToolbar>
);

export const UserList = () => (
  <List
    filters={userFilters}
    actions={<UserListActions />}
    sort={{ field: "name", order: "ASC" }}
    perPage={25}
    className="bg-background"
  >
    <Datagrid
      rowClick={false}
      className="bg-card border border-border rounded-lg"
      sx={{
        "& .RaDatagrid-table": {
          backgroundColor: "var(--color-card)",
          color: "var(--color-card-foreground)",
        },
        "& .RaDatagrid-headerRow": {
          backgroundColor: "var(--color-muted)",
          color: "var(--color-muted-foreground)",
        },
        "& .RaDatagrid-row:hover": {
          backgroundColor: "var(--color-accent)",
        },
      }}
    >
      <TextField source="name" sortable className="font-medium" />
      <EmailField source="email" sortable />
      <NumberField source="age" sortable />
      <BooleanField
        source="email_validated"
        sortable
        label="Email Validated"
        sx={{
          "& .RaBooleanField-true": { color: "var(--color-chart-2)" },
          "& .RaBooleanField-false": { color: "var(--color-destructive)" },
        }}
      />
      <TextField source="city" sortable />
      <UserRowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = () => {
  const navigate = useNavigate();

  return (
    <Edit
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        mt: 4,
      }}
    >
      <SimpleForm
        sx={{
          minWidth: 300,
          width: 600,
          backgroundColor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          "& .MuiFormControl-root": { mb: 2 },
        }}
      >
        <div className="flex items-center justify-between mb-6 gap-2">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          ></Button>
          <h1 className="text-2xl font-semibold text-center flex-1">
            Edit User
          </h1>
        </div>

        <TextInput source="name" validate={[required()]} fullWidth />
        <TextInput source="email" validate={[required(), email()]} fullWidth />
        <NumberInput source="age" validate={[required()]} fullWidth />
        <BooleanInput source="email_validated" label="Email Validated" />
        <TextInput source="city" validate={[required()]} fullWidth />
      </SimpleForm>
    </Edit>
  );
};
