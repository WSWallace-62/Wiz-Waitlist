import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Trash2, X, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import { insertUserSchema } from "@db/schema";
import { useLocation } from "wouter";
import * as z from "zod";
import { useState } from "react";

interface WaitlistEntry {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

const updateCredentialsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newUsername: z.string().min(3, "Username must be at least 3 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Admin() {
  const { user, login, logout, isLoading: isAuthLoading } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  const loginForm = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const settingsForm = useForm<z.infer<typeof updateCredentialsSchema>>({
    resolver: zodResolver(updateCredentialsSchema),
    defaultValues: {
      currentPassword: "",
      newUsername: "",
      newPassword: "",
    },
  });

  const { data: waitlist, isLoading: isWaitlistLoading, error } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
    enabled: !!user,
  });

  const updateCredentialsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof updateCredentialsSchema>) => {
      const response = await fetch("/api/admin/credentials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Credentials updated successfully. Please log in again.",
      });
      settingsForm.reset();
      setShowSettings(false);
      // Force logout to require re-authentication with new credentials
      queryClient.setQueryData(["user"], null);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof insertUserSchema>) => {
    const result = await login(values);
    if (!result.ok) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: result.message,
      });
    }
  };

  const onUpdateCredentials = async (values: z.infer<typeof updateCredentialsSchema>) => {
    updateCredentialsMutation.mutate(values);
  };

  const handleClose = async () => {
    await logout();
    setLocation("/");
  };

  if (isAuthLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container max-w-md py-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="password" placeholder="Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isWaitlistLoading) {
    return <div className="p-8">Loading waitlist...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading waitlist entries</div>;
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Waitlist Subscribers</CardTitle>
            <Button
              variant="outline"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
              }}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {showSettings ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Update Admin Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...settingsForm}>
                  <form onSubmit={settingsForm.handleSubmit(onUpdateCredentials)} className="space-y-4">
                    <FormField
                      control={settingsForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" placeholder="Current Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={settingsForm.control}
                      name="newUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="New Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={settingsForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="password" placeholder="New Password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowSettings(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={updateCredentialsMutation.isPending}>
                        {updateCredentialsMutation.isPending ? "Updating..." : "Update Credentials"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : null}
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {waitlist?.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="grid gap-1">
                        <div className="font-semibold">{entry.fullName}</div>
                        <div className="text-sm text-muted-foreground">{entry.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined {format(new Date(entry.createdAt), "PPP 'at' pp")}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(entry.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}