import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

type TodoStatus = "todo" | "in_progress" | "done";

interface TodoCardProps {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  onDelete: (id: string) => void;
}

const statusConfig: Record<TodoStatus, { label: string; className: string }> = {
  todo: { label: "À faire", className: "bg-status-todo text-white" },
  in_progress: { label: "En cours", className: "bg-status-in-progress text-white" },
  done: { label: "Terminé", className: "bg-status-done text-white" },
};

export const TodoCard = ({ id, title, description, status, onDelete }: TodoCardProps) => {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </div>
        
        {description && (
          <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/edit/${id}`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cette tâche sera définitivement supprimée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
