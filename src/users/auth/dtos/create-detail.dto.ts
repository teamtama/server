import { InputType, PickType } from '@nestjs/graphql';
import { Detail } from '../entities/detail.entity';

@InputType()
export class CreateDetailInput extends PickType(Detail, [
  'position',
  'experience',
  'status',
  'company',
  'introduce',
  'startDate',
]) {}
