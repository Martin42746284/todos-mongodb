import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, MoreVertical, CheckCircle2, Clock, ListTodo, Pencil } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TodoStatus = "todo" | "in progress" | "done";

interface TodoCardProps {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt?: string;
  updatedAt?: string;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: TodoStatus) => void;
}

const statusConfig: Record<TodoStatus, { 
  label: string; 
  className: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = {
  todo: { 
    label: "À faire", 
    className: "bg-blue-500 text-white hover:bg-blue-600",
    icon: ListTodo,
    color: "text-blue-500"
  },
  "in progress": { 
    label: "En cours", 
    className: "bg-orange-500 text-white hover:bg-orange-600",
    icon: Clock,
    color: "text-orange-500"
  },
  done: { 
    label: "Terminé", 
    className: "bg-green-500 text-white hover:bg-green-600",
    icon: CheckCircle2,
    color: "text-green-500"
  },
};

export const TodoCard = ({ 
  id, 
  title, 
  description, 
  status, 
  createdAt,
  updatedAt,
  onDelete,
  onStatusChange 
}: TodoCardProps) => {
  const navigate = useNavigate();
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;
  const [open, setOpen] = useState(false);

  // Pour le modal: affichage du détail au clic sur la carte
  const handleCardClick = (e: React.MouseEvent) => {
    // Empêche l'ouverture du modal via un clic sur le badge ou menu
    if ((e.target as HTMLElement).closest('.no-modal')) return;
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Card 
          className="transition-all hover:shadow-lg cursor-pointer group border-l-4"
          onClick={handleCardClick}
          style={{ 
            borderLeftColor: status === "todo" ? "#3b82f6" : status === "in progress" ? "#f97316" : "#22c55e" 
          }}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                  {title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Badge de statut cliquable avec dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="no-modal" onClick={(e) => e.stopPropagation()}>
                      <Badge 
                        className={`${statusInfo.className} cursor-pointer flex items-center gap-1.5 px-3 py-1 transition-all hover:scale-105`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(Object.entries(statusConfig) as [TodoStatus, typeof statusConfig[TodoStatus]][]).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <DropdownMenuItem
                          key={key}
                          onSelect={(e) => {
                            e.preventDefault();
                            if (onStatusChange && key !== status) {
                              onStatusChange(id, key);
                            }
                          }}
                          className={`flex items-center gap-2 cursor-pointer ${key === status ? 'bg-accent' : ''}`}
                        >
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          <span>{config.label}</span>
                          {key === status && (
                            <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Menu d'actions (trois points) */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="no-modal" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        navigate(`/edit/${id}`);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Cette tâche sera définitivement supprimée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(id);
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {description && (
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {description}
              </p>
            )}
            
            {/* Indicateur visuel en bas */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-3 h-3 ${statusInfo.color}`} />
                <span>Cliquez pour voir le détail</span>
              </div>
              <span className="text-xs opacity-70">Badge = changement rapide</span>
            </div>
          </CardContent>
        </Card>

        {/* Modal de détail */}
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-3">
              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description || <em className="text-muted-foreground">Aucune description</em>}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Statut :</span>{" "}
              <Badge className={`${statusInfo.className} ml-2`}>{statusInfo.label}</Badge>
            </div>
            {createdAt && (
              <div>
                <span className="font-medium text-muted-foreground">Créée :</span>{" "}
                {new Date(createdAt).toLocaleString()}
              </div>
            )}
            {updatedAt && (
              <div>
                <span className="font-medium text-muted-foreground">Modifiée :</span>{" "}
                {new Date(updatedAt).toLocaleString()}
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
