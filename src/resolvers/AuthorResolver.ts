import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    Info,
    InputType,
    Mutation,
    Query,
    Resolver,
    Root
} from "type-graphql";
import {getConnection} from "typeorm";
import {Author} from "../entity/Author";
import {GraphQLResolveInfo} from "graphql";
import {Book} from "../entity/Book";
import {AppContext} from "../index";
import {FieldsByTypeName, parseResolveInfo} from "graphql-parse-resolve-info";

@InputType()
class AddAuthor {
    @Field(() => String)
    first_name!: string;

    @Field(() => String)
    last_name!: string;
}

@InputType()
class AddBookWithAuthor {
    @Field(() => String)
    title!: string;

    @Field(() => Number)
    price!: number;
}

@Resolver(() => Author)
export class AuthorResolver {

    @Query(() => [Author])
    async authors(@Info() info: GraphQLResolveInfo) {
        const fields = parseResolveInfo(info)?.fieldsByTypeName;
        const relations: string[] = [];

        if (((fields?.Author as {}) || {}).hasOwnProperty("books")) {
          relations.push("books");
        }

        return await getConnection().getRepository(Author).find({relations});
    }

    @Query(() => Author, {nullable: true})
    async author(@Arg("author_input") id: number) {
        return await getConnection().getRepository(Author).findOne({id})
    }

    @Mutation(() => Author)
    async addAuthor(@Arg("author") author: AddAuthor, @Arg("books", () => [AddBookWithAuthor], {nullable: true}) books: [AddBookWithAuthor]) {
        const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Author)
            .values(author)
            .returning("*")
            .execute();

        if (books) {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Book)
                .values(books.map(b => ({...b, author: result.raw[0].id})))
                .returning("*")
                .execute();
        }

        return result.raw[0];
    }



    @Mutation(() => Boolean)
    async deleteAuthor(@Arg("id") id: number) {
        await getConnection().createQueryBuilder()
            .delete()
            .from(Author)
            .where("id = :id", {id})
            .execute();

        return true;
    }
}
