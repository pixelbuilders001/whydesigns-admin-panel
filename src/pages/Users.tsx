import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/api";
import type { User } from "@/lib/api";
import { cn } from "@/lib/utils";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getUsers(page, 8);

      if (response.success && response.data) {
        setUsers(response.data);
        setTotalPages(response.meta?.totalPages || 1);
        setTotalUsers(response.meta?.total || 0);
        setCurrentPage(page);
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchUsers(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Users ({totalUsers})
            </h1>
            <p className="text-muted-foreground">
              Manage and view all registered users.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="shadow-md rounded-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="shadow-md rounded-md">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-gray-900 dark:text-gray-100">Name</TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-gray-100">Email</TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-gray-100">Phone</TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-gray-100">Gender</TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-gray-100">Status</TableHead>
                  <TableHead className="font-medium text-gray-900 dark:text-gray-100">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{user.phoneNumber || "N/A"}</TableCell>
                      <TableCell className="capitalize text-gray-700 dark:text-gray-300">{user.gender || "N/A"}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        )}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{formatDate(user.createdAt || "")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="rounded-md shadow-sm"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="rounded-md shadow-sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;