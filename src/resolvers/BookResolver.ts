import {Arg, Field, FieldResolver, Info, InputType, Mutation, Query, Resolver, Root} from "type-graphql";
import {Book} from "../entity/Book";
import {getConnection} from "typeorm";
import {parseResolveInfo} from "graphql-parse-resolve-info";
import {GraphQLResolveInfo} from "graphql";

@InputType()
class AddBook {
    @Field(() => String)
    title!: string;

    @Field(() => Number)
    price!: number;

    @Field(() => Number)
    author_id!: number;
}

@Resolver(() => Book)
export class BookResolver {
    @Query(() => [Book])
    async books(@Info() info: GraphQLResolveInfo) {
        const fields = parseResolveInfo(info)?.fieldsByTypeName;
        const relations: string[] = [];

        if (((fields?.Book as {}) || {}).hasOwnProperty("author")) {
            relations.push("author");
        }

        return await getConnection().getRepository(Book).find({relations});
    }

    @Mutation(() => Number)
    async addBook(@Arg("book") book: AddBook) {
        const result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Book)
            .values(book)
            .returning("id")
            .execute();

        return result.raw.id;
    }

    @Mutation(() => Boolean)
    async deleteBook(@Arg("id") id: number) {
        await getConnection().createQueryBuilder()
            .delete()
            .from(Book)
            .where("id = :id", {id})
            .execute();

        return true;
    }
}
