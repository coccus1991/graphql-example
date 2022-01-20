import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Book} from "./Book";

@Entity()
@ObjectType()
export class Author {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Field(() => String)
    @Column({ type: 'varchar', nullable: true })
    first_name: string | undefined

    @Field(() => String)
    @Column({ type: 'varchar', nullable: true })
    last_name: string | undefined

    @Field(() => [Book], {nullable: true})
    @OneToMany(() => Book, book => book.author)
    books: Array<Book> | undefined
}
