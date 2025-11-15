import { useState } from "react";
import { authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Mail, Lock, User, Sparkles, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const data = await authAPI.login(formData.email, formData.password);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        toast({
          title: "✨ Connexion réussie",
          description: `Bienvenue ${data.user.name}!`,
        });
        
        navigate('/', { replace: true });
        window.location.reload();
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Les mots de passe ne correspondent pas",
          });
          setLoading(false);
          return;
        }

        await authAPI.register(formData.name, formData.email, formData.password);
        
        toast({
          title: "🎉 Inscription réussie",
          description: "Vous pouvez maintenant vous connecter.",
        });
        
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Cercles de décoration en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Gradient de fond dans le header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <CardHeader className="space-y-3 pb-6 pt-8">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-gradient-to-br from-primary to-primary/60 rounded-2xl shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {isLogin ? "Bon retour !" : "Créer un compte"}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isLogin 
              ? "Connectez-vous pour gérer vos tâches" 
              : "Rejoignez-nous pour commencer à organiser vos projets"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Nom complet
                </Label>
                <Input
                  id="name"
                  placeholder="Entrez votre nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Etrez votre adresse email ici"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="h-11 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Minimum 6 caractères
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required={!isLogin}
                    minLength={6}
                    className="h-11 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isLogin ? "Connexion..." : "Création du compte..."}
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Se connecter
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Créer mon compte
                    </>
                  )}
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 transition-all hover:bg-muted"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              {isLogin ? (
                <>
                  Pas encore de compte ? <span className="ml-1 font-semibold text-primary">S'inscrire</span>
                </>
              ) : (
                <>
                  Déjà un compte ? <span className="ml-1 font-semibold text-primary">Se connecter</span>
                </>
              )}
            </Button>
          </form>

          {/* Footer avec info sécurité */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-center text-muted-foreground">
              🔒 Vos données sont sécurisées et chiffrées
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
