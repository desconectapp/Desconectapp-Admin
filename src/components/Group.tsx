import { useState, useEffect } from "react";
import { List, Datagrid, TextField, NumberField, Button, useRecordContext, SimpleForm, Create, Toolbar, SaveButton, TextInput, required, ReferenceInput, AutocompleteInput, useNotify, useRedirect, ReferenceArrayInput, AutocompleteArrayInput, EditButton, Edit } from "react-admin";
import { Dialog, DialogTitle, DialogContent, Divider, Typography, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BASE_API_URL } from "../constants";

const GroupRowButton = () => {
  const record = useRecordContext();
  const [open, setOpen] = useState(false);

  if (!record) return null;

  return (
    <>
      <Button label="Members" onClick={() => setOpen(true)} />
      <GroupMembersModal group={record} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const GroupList = () => (
  <List>
    <Datagrid rowClick={false}>
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="member_count" />
      <GroupRowButton />
      <EditButton />
    </Datagrid>
  </List>
);


const GroupCreateToolbar = ({ onCancel }: { onCancel: () => void }) => (
  <Toolbar>
    <SaveButton />
    <Button onClick={onCancel} sx={{ ml: 2 }} variant="outlined">
      Cancel
    </Button>
  </Toolbar>
);

export const GroupCreate = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Create
      transform={(data: any) => ({
        ...data,
        activity_id: Number(data.activity_id),
      })}
      mutationOptions={{
        onSuccess: async (created: any, { data: submitted }: any) => {
          const userIds: number[] = submitted?.user_ids ?? [];
          if (userIds.length > 0 && created?.id) {
            await Promise.all(
              userIds.map((uid) =>
                fetch(`${BASE_API_URL}/admin/groups/${created.id}/members`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ user_id: uid }),
                })
              )
            );
          }
          notify("Group created", { type: "info" });
          redirect("list", "groups");
        },
      }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        mt: 4,
      }}
    >
      <SimpleForm
        toolbar={<GroupCreateToolbar onCancel={() => navigate(-1)} />}
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

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        ></Button>
        <TextInput
          source="name"
          label="Group Name"
          validate={[required()]}
          fullWidth
        />
        <TextInput source="description" label="Description" multiline minRows={3} fullWidth />
        <TextInput source="location" label="Location" fullWidth />

        <ReferenceInput
          source="activity_id"
          reference="activities"
          label="Activity"
          sort={{ field: "id", order: "ASC" }}
          filterToQuery={(search: string) => ({ name: search })}
          perPage={25}
        >
          <AutocompleteInput
            optionText={(u: any) => `${u?.icon} ${u?.name}`}
            optionValue="id"
            fullWidth
            validate={[required()]}
          />
        </ReferenceInput>

        <ReferenceArrayInput
          source="user_ids"
          reference="users"
          label="Members"
          perPage={50}
        >
          <AutocompleteArrayInput
            optionText={(u: any) => (u?.email ? `${u.name} <${u.email}>` : u?.name)}
            optionValue="id"
            fullWidth
          />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};


const MembersAddToolbar = () => (
  <Toolbar>
    <SaveButton label="Add selected users" />
  </Toolbar>
);

type Group = { id: number; name: string };
type Member = { id: number; name: string; email?: string | null };

export const GroupMembersModal = ({
  group,
  open,
  onClose,
}: {
  group: Group;
  open: boolean;
  onClose: () => void;
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const fetchMembers = async () => {
    if (!group?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${HOST}/groups/${group.id}/members`, {
        credentials: "include",
      });
      const data = await res.json();
      setMembers(data || []);
    } catch (e: any) {
      notify(`Failed to load members: ${e?.message || e}`, { type: "warning" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, group?.id]);

  const removeMember = async (userId: number) => {
    try {
      await fetch(`${HOST}/groups/${group.id}/members/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      notify("Member removed", { type: "info" });
    } catch (e: any) {
      notify(`Failed to remove: ${e?.message || e}`, { type: "warning" });
    }
  };

  const onAddMembers = async (values: { user_ids?: number[] }) => {
    const toAdd = (values.user_ids ?? []).filter(
      (uid) => !members.some((m) => m.id === uid)
    );
    if (toAdd.length === 0) {
      notify("No new users selected", { type: "info" });
      return;
    }

    try {
      await Promise.all(
        toAdd.map((uid) =>
          fetch(`${HOST}/groups/${group.id}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ user_id: uid }),
          })
        )
      );
      notify("Members added", { type: "info" });
      await fetchMembers();
    } catch (e: any) {
      notify(`Failed to add members: ${e?.message || e}`, { type: "warning" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Members of {group?.name}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Add members
        </Typography>
        <SimpleForm
          onSubmit={onAddMembers}
          toolbar={<MembersAddToolbar />}
          defaultValues={{ user_ids: [] }}
          sx={{
            "& .MuiFormControl-root": { mb: 2 },
            backgroundColor: "transparent",
            p: 0,
          }}
        >
          <ReferenceArrayInput
            source="user_ids"
            reference="users"
            label="Select users"
            sort={{ field: "name", order: "ASC" }}
            perPage={50}
            // Adjust to your users search param (you used "q" elsewhere)
            filterToQuery={(search: string) => ({ q: search })}
            validate={[required()]}
          >
            <AutocompleteArrayInput
              fullWidth
              optionValue="id"
              optionText={(u: any) =>
                u?.email ? `${u.name} <${u.email}>` : u?.name
              }
            />
          </ReferenceArrayInput>
        </SimpleForm>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Current members {loading ? "(loading…)" : `(${members.length})`}
        </Typography>
        {members.map((m) => (
          <div
            key={m.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <span>
              {m.name}
              {m.email ? ` (${m.email})` : ""}
            </span>
            <Button color="error" onClick={() => removeMember(m.id)}>
              Remove
            </Button>
          </div>
        ))}
        {members.length === 0 && !loading && (
          <Typography variant="body2" color="text.secondary">
            No members yet.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export const GroupEdit = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <Edit
      transform={(data: any) => ({
        ...data,
        activity_id: Number(data.activity_id),
      })}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        mt: 4,
      }}
    >
      <SimpleForm
        toolbar={<GroupCreateToolbar onCancel={() => navigate(-1)} />}
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

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        ></Button>
        <TextInput
          source="name"
          label="Group Name"
          validate={[required()]}
          fullWidth
        />
        <TextInput source="description" label="Description" multiline minRows={3} fullWidth />
        <TextInput source="location" label="Location" fullWidth />

        <ReferenceInput
          source="activity_id"
          reference="activities"
          label="Activity"
          sort={{ field: "id", order: "ASC" }}
          filterToQuery={(search: string) => ({ name: search })}
          perPage={25}
        >
          <AutocompleteInput
            optionText={(u: any) => `${u?.icon} ${u?.name}`}
            optionValue="id"
            fullWidth
            validate={[required()]}
          />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};
