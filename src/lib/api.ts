import serverJsonLocal from '@/lib/servers.json'

export async function fetchServers() {
    try {
        const response = await fetch('https://milisp.github.io/mcp-store/public/servers.json', { cache: 'no-store' });
        return await response.json(); // returns { version, servers }
    } catch (error) {
        console.error("Error fetching servers:", error);
        return {
            version: serverJsonLocal.version,
            servers: serverJsonLocal.servers
        };
    }
}