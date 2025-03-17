import { App } from "../types";

export const Apps: App[] = [
  {
    id: 1,
    name: "Sequential Thinking",
    developer: "modelcontextprotocol",
    image: "/image1.jpg",
    description: "Thinking",

    command: "npx",
    args: "-y @modelcontextprotocol/server-sequential-thinking",
  },
  {
    id: 2,
    name: "Brave Search",
    developer: "modelcontextprotocol",
    image: "/image2.jpg",
    description: "Brave",
    command: "npx",
    args: "-y @modelcontextprotocol/server-brave-search",
    env: {
      BRAVE_API_KEY: "",
    },
  },
  {
    id: 3,
    name: "notion-api",
    command: "uvx",
    args: "notion_api_mcp",
    env: {
      NOTION_API_KEY: "",
      NOTION_PARENT_PAGE_ID: "",
      NOTION_DATABASE_ID: "",
    },
  },
];
