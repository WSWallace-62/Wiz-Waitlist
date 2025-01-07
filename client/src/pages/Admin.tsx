import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface WaitlistEntry {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export default function Admin() {
  const { data: waitlist, isLoading, error } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading waitlist entries</div>;
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {waitlist?.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="grid gap-1">
                      <div className="font-semibold">{entry.fullName}</div>
                      <div className="text-sm text-muted-foreground">{entry.email}</div>
                      <div className="text-xs text-muted-foreground">
                        Joined {format(new Date(entry.createdAt), "PPP 'at' pp")}
                      </div>
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
