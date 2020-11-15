import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateUserSkillInput {
  @Field(() => String)
  @IsString()
  skillId: string;
}
