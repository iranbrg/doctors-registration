import app from "./app";
import db from "./database";

const PORT = process.env.PORT || 3000;

(async (): Promise<void> => {
    let retries = 5;

    while (retries) {
        try {
            await db.connect();
            console.log("Succesfully connected to database");
            break;
        } catch (err) {
            console.error((err as Error).stack);

            --retries;

            console.log(`Retries left: ${retries}`);

            // Wait 5 seconds until next retry
            await new Promise((resolve, reject) => setTimeout(resolve, 5000))
        }
    }

    app.listen(PORT, () =>
        console.log(`Server running on ${process.env.API_URL}`)
    );
})();
