export type serverConfig = {
  command: string;
  args?: string[];
  env?: Record<string, any>;
};

export type Server = {
  id?: number;
  name: string;
  developer?: string;
  icon_url?: string;
  description: string;
  category?: string;
  source?: string;
  is_official?: boolean;
  is_hot?: boolean;
  is_featured?: boolean;
  configs: serverConfig[];
};
