import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  required,
  email,
} from "react-admin";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

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
          >
          </Button>
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
