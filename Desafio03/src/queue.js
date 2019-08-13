import "dotenv/config";
import "./database";

import Queue from "./lib/Queue";

Queue.processQueue();
