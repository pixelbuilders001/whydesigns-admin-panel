import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const users = [
  { name: "John Doe", email: "john@example.com", phone: "+1234567890", gender: "Male" },
  { name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", gender: "Female" },
  { name: "Bob Johnson", email: "bob@example.com", phone: "+1234567892", gender: "Male" },
  { name: "Alice Brown", email: "alice@example.com", phone: "+1234567893", gender: "Female" },
  { name: "Charlie Wilson", email: "charlie@example.com", phone: "+1234567894", gender: "Male" },
];

const Users = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage and view all registered users.
            </p>
          </div>
        </div>

        <Card>
       
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;