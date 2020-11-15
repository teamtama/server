import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { UserSkill } from '../user-skill/user-skill.entity';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Skill {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @IsString()
  @Column()
  name: string;

  @Field(() => [UserSkill])
  @OneToMany(
    () => UserSkill,
    userSkill => userSkill.skill,
    { onDelete: 'CASCADE' },
  )
  users: UserSkill[];
}
