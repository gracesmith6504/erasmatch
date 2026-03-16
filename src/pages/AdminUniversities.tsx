import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Save, Search, AlertTriangle, ShieldAlert } from "lucide-react";

type UniversityRow = {
  id: number;
  name: string;
  city: string | null;
  country: string | null;
};

const AdminUniversities = () => {
  const { currentUserId } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading
  const [universities, setUniversities] = useState<UniversityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"incomplete" | "all">("incomplete");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");

  // Check admin role from user_roles table (server-side via RLS)
  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUserId) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUserId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    };

    checkAdmin();
  }, [currentUserId]);

  useEffect(() => {
    if (isAdmin) {
      fetchUniversities();
    }
  }, [filter, isAdmin]);

  const fetchUniversities = async () => {
    setLoading(true);
    let query = supabase
      .from("universities")
      .select("id, name, city, country")
      .order("name");

    if (filter === "incomplete") {
      query = query.or("city.is.null,country.is.null");
    }

    const { data, error } = await query;

    if (error) {
      toast.error("Failed to load universities");
      console.error(error);
    } else {
      setUniversities(data || []);
    }
    setLoading(false);
  };

  const startEditing = (uni: UniversityRow) => {
    setEditingId(uni.id);
    setEditCity(uni.city || "");
    setEditCountry(uni.country || "");
  };

  const saveEdit = async (id: number) => {
    const { error } = await supabase
      .from("universities")
      .update({ 
        city: editCity.trim() || null, 
        country: editCountry.trim() || null 
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update — you may not have admin permissions");
      console.error(error);
    } else {
      toast.success("University updated");
      setEditingId(null);
      fetchUniversities();
    }
  };

  const deleteUniversity = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const { error } = await supabase
      .from("universities")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete — you may not have admin permissions");
      console.error(error);
    } else {
      toast.success(`Deleted "${name}"`);
      fetchUniversities();
    }
  };

  const filteredUniversities = universities.filter(uni =>
    !searchQuery || uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state while checking role
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  // Not admin — show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have admin permissions. Contact a team admin to get the admin role assigned to your account.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">University Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and clean up manually added universities
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search universities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "incomplete" ? "default" : "outline"}
              onClick={() => setFilter("incomplete")}
              size="sm"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Incomplete ({filter === "incomplete" ? filteredUniversities.length : "..."})
            </Button>
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              All
            </Button>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Showing {filteredUniversities.length} universities</span>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading...</p>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">All clean! 🎉</p>
            <p className="text-sm mt-1">No universities need attention.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUniversities.map((uni) => (
                  <TableRow key={uni.id}>
                    <TableCell className="font-medium">{uni.name}</TableCell>
                    <TableCell>
                      {editingId === uni.id ? (
                        <Input
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          placeholder="City"
                          className="h-8"
                        />
                      ) : uni.city ? (
                        uni.city
                      ) : (
                        <Badge variant="outline" className="text-destructive border-destructive/30">
                          Missing
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === uni.id ? (
                        <Input
                          value={editCountry}
                          onChange={(e) => setEditCountry(e.target.value)}
                          placeholder="Country"
                          className="h-8"
                        />
                      ) : uni.country ? (
                        uni.country
                      ) : (
                        <Badge variant="outline" className="text-destructive border-destructive/30">
                          Missing
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {editingId === uni.id ? (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => saveEdit(uni.id)}>
                              <Save className="h-4 w-4 text-primary" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                              ✕
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => startEditing(uni)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteUniversity(uni.id, uni.name)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUniversities;
