import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, ObjectType} from "type-graphql";
import {Author} from "./Author";

@ObjectType()
@Entity()
export class Book {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Field(() => String)
    @Column({ type: 'varchar', nullable: true })
    title: string | undefined

    @Field(() => Number)
    @Column({ type: 'varchar', nullable: true })
    price: number | undefined

    @ManyToOne(() => Author, author => author.books)
    @Field(() => Author, {nullable: true})
    author: Author | undefined
}
