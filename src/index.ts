import express from "express";
import {createConnection} from "typeorm";
import {buildSchema} from "type-graphql";
import {ApolloServer} from "apollo-server-express";
import {BookResolver} from "./resolvers/BookResolver";
import {AuthorResolver} from "./resolvers/AuthorResolver";
import {createDatabase} from "typeorm-extension";

export type AppContext = {
    req: express.Request,
    res: express.Response
}

(async () => {
    const app = express()
    const port = 3000;

    await createDatabase({ifNotExist: true, characterSet: "UTF8"});

    await createConnection();

    const schema = await buildSchema({
        resolvers: [
            BookResolver,
            AuthorResolver
        ],
        emitSchemaFile: true,
        validate: false,
    });

    const apolloServer = new ApolloServer({
        schema: schema,
        context: ({req, res}): AppContext => {
            return {
                req,
                res
            };
        },
        debug: false
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: true});

    app.get("/", (req, res) => {
        res.send("Hello world")
    })


    app.listen(port, () => console.log("App listening on port: " + port))
})()