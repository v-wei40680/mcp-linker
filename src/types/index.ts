export type App = {
  id: number;
  name: string;
  developer?: string;
  image?: string;
  description?: string;
  command: string;
  args: string;
  env?: Record<string, any>;
};
