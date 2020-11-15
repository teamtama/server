import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateSkillInput } from './create-skill.dto';

@InputType()
export class UpdateSkillInput extends PartialType(CreateSkillInput) {
  @Field(type => String)
  @IsString()
  @IsNotEmpty()
  skillId: string;
}
