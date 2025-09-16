export type App = {
  id: 'about' | 'resume' | 'projects' | 'terminal' | 'contact';
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
};

export type WindowInstance = {
  id: string;
  appId: App['id'];
  title: string;
  position: { x: number; y: number };
  size: { width: number, height: number };
  zIndex: number;
};
