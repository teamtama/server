import { Field, InputType, PartialType } from '@nestjs/graphql';
import { RegisterInput } from './register.dto';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(RegisterInput) {
  @Field(() => String)
  @IsOptional()
  @IsString()
  avatar: string;
}
