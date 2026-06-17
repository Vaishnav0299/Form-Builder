import { useNavigate } from "react-router-dom";
import { ArrowLeft, Key, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="h-16 border-b flex items-center px-4 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="rounded-full h-10 w-10 mr-4"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-10 px-6 animate-in fade-in duration-500">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-6">
          {/* Section: General */}
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              General Preferences
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold">Automatic Saving</p>
                  <p className="text-xs text-muted-foreground">Automatically save changes to forms</p>
                </div>
                <div className="w-10 h-6 bg-emerald-500 rounded-full p-1 cursor-pointer flex justify-end">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold">Developer Tools</p>
                  <p className="text-xs text-muted-foreground">Show extra analytics and diagnostic panels</p>
                </div>
                <div className="w-10 h-6 bg-muted-foreground/30 rounded-full p-1 cursor-pointer flex justify-start">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Security */}
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              Security & API Access
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold">Active Session Logging</p>
                  <p className="text-xs text-muted-foreground">Log browser details on login</p>
                </div>
                <div className="w-10 h-6 bg-emerald-500 rounded-full p-1 cursor-pointer flex justify-end">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Require confirmation code on access</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg text-xs h-8">
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
