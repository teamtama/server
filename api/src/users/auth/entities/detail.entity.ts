import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { User } from './user.entitiy';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
@Entity()
export class Detail {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => Boolean)
  @IsBoolean()
  @Column({ default: false })
  status: boolean;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Column()
  position: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Column()
  company: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  @Column()
  introduce: string;

  @Field(() => Number)
  @IsNumber()
  @IsOptional()
  @Column()
  @Min(0)
  @Max(40)
  experience: number;

  @Field(() => Date)
  @IsOptional()
  @Column('timestamp', {
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  startDate: Date;

  @Field(() => String)
  @Column()
  userId: string;
  @OneToOne(
    type => User,
    user => user.sns,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'userId' })
  user: User;
}
