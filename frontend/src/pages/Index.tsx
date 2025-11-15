import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { todoAPI, Todo } from "@/services/api";
import { TodoCard } from "@/components/TodoCard";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from "@/components/AuthForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TodoStatus = "todo" | "in progress" | "done";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      fetchTodos();
    } else {
      setUser(null);
      setLoading(false);
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoAPI.getAll();
      setTodos(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de charger les tâches",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast({
        title: "🗑️ Tâche supprimée",
        description: "La tâche a été supprimée avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de supprimer la tâche",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTodos([]);
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const handleStatusChange = async (id: string, newStatus: TodoStatus) => {
    try {
      const todo = todos.find(t => t._id === id);
      if (!todo) {
        console.error("Todo not found:", id);
        return;
      }

      await todoAPI.update(id, todo.title, todo.description, newStatus);
      setTodos(todos.map(t => t._id === id ? { ...t, status: newStatus } : t));
      
      const statusLabels = {
        "todo": "À faire",
        "in progress": "En cours",
        "done": "Terminé"
      };
      
      toast({
        title: "✅ Statut mis à jour",
        description: `La tâche est maintenant "${statusLabels[newStatus]}"`,
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de mettre à jour le statut",
      });
    }
  };

  const filteredTodos = activeTab === "all" 
    ? todos 
    : todos.filter(todo => todo.status === activeTab);

  const stats = {
    total: todos.length,
    todo: todos.filter(t => t.status === "todo").length,
    inProgress: todos.filter(t => t.status === "in progress").length,
    done: todos.filter(t => t.status === "done").length,
  };

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header avec dégradé */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mes Tâches
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Bienvenue, {user.name}
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("all")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <ListTodo className="w-8 h-8 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("todo")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">À faire</p>
                  <p className="text-2xl font-bold">{stats.todo}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("in progress")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab("done")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Terminées</p>
                  <p className="text-2xl font-bold">{stats.done}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres par onglets avec bouton Ajouter */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <TabsList className="grid w-full sm:w-auto grid-cols-4 gap-2">
              <TabsTrigger value="all" className="gap-2">
                Toutes
                <Badge variant="secondary" className="ml-1">{stats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="todo" className="gap-2">
                À faire
                <Badge variant="secondary" className="ml-1">{stats.todo}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in progress" className="gap-2">
                En cours
                <Badge variant="secondary" className="ml-1">{stats.inProgress}</Badge>
              </TabsTrigger>
              <TabsTrigger value="done" className="gap-2">
                Terminées
                <Badge variant="secondary" className="ml-1">{stats.done}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* Bouton Ajouter à côté des onglets */}
            <Button 
              onClick={() => navigate("/add")} 
              className="gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Ajouter une tâche
            </Button>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : filteredTodos.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <ListTodo className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {activeTab === "all" 
                      ? "Aucune tâche pour le moment" 
                      : `Aucune tâche ${activeTab === "todo" ? "à faire" : activeTab === "in progress" ? "en cours" : "terminée"}`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Cliquez sur le bouton "Ajouter une tâche" pour commencer
                  </p>
                  <Button onClick={() => navigate("/add")} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter une tâche
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
                {filteredTodos.map((todo, index) => (
                  <div 
                    key={todo._id}
                    className="animate-in slide-in-from-bottom duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TodoCard
                      id={todo._id}
                      title={todo.title}
                      description={todo.description || undefined}
                      status={todo.status}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
