import { config } from "dotenv";
import connectDB from "./db/mongoDB";
import {app} from "./app"

config();

const port = process.env.PORT || 3005;

connectDB();
app.get('/', (req, res) => {
    res.send(`Server is up and running on ${port}`)
})


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
