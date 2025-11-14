import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  todo: { label: "To Do", className: "bg-status-todo text-white" },
  in_progress: { label: "In Progress", className: "bg-status-in-progress text-white" },
  done: { label: "Done", className: "bg-status-done text-white" },
};

export const TodoCard = ({ id, title, description, status, onDelete }: TodoCardProps) => {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];

  return (
    <Card 
      className="transition-all hover:shadow-lg cursor-pointer"
      onClick={() => navigate(`/edit/${id}`)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        </div>
        
        {description && (
          <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        )}
        
        <div className="flex gap-2 justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This task will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
