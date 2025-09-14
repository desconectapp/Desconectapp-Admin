import {
  List,
  Datagrid,
  TextField,
  DateField,
  SearchInput,
  SelectInput,
  TopToolbar,
  FilterButton,
  ExportButton,
  CreateButton,
  EditButton,
  Button,
  Edit,
  required,
  TextInput,
  SimpleForm,
  NumberField,
} from "react-admin";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const activityFilters = [
  <SearchInput
    source="name"
    placeholder="Search by name"
    alwaysOn
    key="search-name"
  />,
  <SelectInput
    source="category"
    label="Category"
    choices={[
      { id: "SOCIAL", name: "Social" },
      { id: "CREATIVE", name: "Creative" },
      { id: "SPORT", name: "Sport" },
      { id: "OUTDOOR", name: "Outdoor" },
      { id: "INDOOR", name: "Indoor" },
      { id: "GAME", name: "Game" },
      { id: "WELLNESS", name: "Wellness" },
    ]}
    alwaysOn
    key="search-category"
  />,
];

const ActivityListActions = () => (
  <TopToolbar>
    <FilterButton />
    <ExportButton />
    <CreateButton />
  </TopToolbar>
);


export const ActivityEdit = () => {
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
        <TextInput source="icon" validate={[required()]} fullWidth />
      </SimpleForm>
    </Edit>
  );
};


export const ActivityList = () => (
  <List
    filters={activityFilters}
    actions={<ActivityListActions />}
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
      <TextField source="id" sortable />
      <TextField source="name" sortable className="font-medium" />
      <TextField source="icon" sortable />
      <TextField source="category" sortable />
      <NumberField source="group_count" label="Groups" />
      <NumberField source="partial_match_count" label="Partial Matches" />
      <NumberField source="request_count" label="Requests" />
      <NumberField source="user_count" label="Users" />
      <DateField source="created_at" sortable showTime />
      <EditButton />
    </Datagrid>
  </List>
);
