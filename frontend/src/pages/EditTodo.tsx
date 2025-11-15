import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todoAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, CheckCircle2, Clock, ListTodo, Save, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"todo" | "in progress" | "done">("todo");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    fetchTodo();
  }, [id]);

  const fetchTodo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Vous devez être connecté");
      }

      const todos = await todoAPI.getAll();
      const todo = todos.find(t => t._id === id);

      if (!todo) {
        throw new Error("Tâche introuvable");
      }

      setTitle(todo.title);
      setDescription(todo.description || "");
      setStatus(todo.status);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.error || error.message || "Impossible de charger la tâche",
      });
      navigate("/");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!id) {
        throw new Error("ID de tâche manquant");
      }

      await todoAPI.update(id, title, description, status);

      toast({
        title: "✅ Tâche mise à jour",
        description: "Votre tâche a été mise à jour avec succès",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.error || error.message || "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    try {
      await todoAPI.delete(id);
      toast({
        title: "🗑️ Tâche supprimée",
        description: "La tâche a été supprimée avec succès",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
      });
      setDeleting(false);
    }
  };

  const statusOptions = [
    { value: "todo", label: "À faire", icon: ListTodo, color: "text-blue-500" },
    { value: "in progress", label: "En cours", icon: Clock, color: "text-orange-500" },
    { value: "done", label: "Terminé", icon: CheckCircle2, color: "text-green-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")} 
            className="gap-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-xl border-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="space-y-2 bg-gradient-to-br from-primary/5 to-primary/10 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Save className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Modifier la tâche</CardTitle>
                  <CardDescription className="text-base">
                    Mettez à jour les informations de votre tâche
                  </CardDescription>
                </div>
              </div>
              
              {/* Bouton de suppression */}
              {!fetching && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      disabled={deleting}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer cette tâche ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. La tâche sera définitivement supprimée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {fetching ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-11" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-32" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-11" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-11 flex-1" />
                  <Skeleton className="h-11 flex-1" />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base font-medium">
                    Titre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Titre de la tâche"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={100}
                    className="h-11 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-xs text-muted-foreground">
                    {title.length}/100 caractères
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Description de la tâche (optionnel)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    maxLength={500}
                    className="resize-none text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length}/500 caractères
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-base font-medium">
                    Statut
                  </Label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${option.color}`} />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Aperçu du statut */}
                <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground mb-2">Statut actuel :</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const selectedOption = statusOptions.find(opt => opt.value === status);
                      const Icon = selectedOption?.icon || ListTodo;
                      return (
                        <>
                          <Icon className={`w-5 h-5 ${selectedOption?.color}`} />
                          <span className="font-medium">{selectedOption?.label}</span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="flex-1 h-11 hover:bg-muted transition-colors"
                    disabled={loading || deleting}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-md hover:shadow-lg"
                    disabled={loading || deleting}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Mettez à jour 
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        {!fetching && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-sm text-muted-foreground text-center">
              💡 <span className="font-medium">Astuce :</span> Utilisez le bouton de suppression en haut à droite pour supprimer cette tâche
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditTodo;
