import { InputType, PickType } from '@nestjs/graphql';
import { Skill } from '../skill.entitiy';

@InputType()
export class CreateSkillInput extends PickType(Skill, ['name']) {}
