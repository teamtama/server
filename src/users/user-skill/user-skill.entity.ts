import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { User } from '../auth/entities/user.entitiy';
import { Skill } from '../skill/skill.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class UserSkill {
  @PrimaryColumn()
  userId: string;
  @ManyToOne(() => User, user => user.skills, { onDelete: 'CASCADE' },)
  @JoinColumn({ name: "userId" })
  user: User;

  @PrimaryColumn()
  skillId: string;
  @ManyToOne(() => Skill, skill => skill.users)
  @JoinColumn({ name: "skillId" })
  skill: Skill;
}
