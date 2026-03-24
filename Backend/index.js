import 'dotenv/config';
import Server from './server.js';

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const server = new Server();

server.escuchar();
