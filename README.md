# MCP Store

add Model Context Protocol (MCP) server to your mcp client (claude cursor) with two click. get and add.

[official servers](https://github.com/modelcontextprotocol/servers)

if you want to contribute, fork and pull requests add your project to folder `servers` and add `mcp.json`

```json
{
  "mcpServers": {
    "example-mcp": {
      "command": "uvx",
      "args": ["example-mcp"]
    }
  }
}
```
