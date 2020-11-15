import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { Skill } from '../users/skill/skill.entitiy';

export const SkillsLoader = () =>
  new DataLoader(async (keys: string[]) => {
    return await getRepository(Skill)
      .createQueryBuilder('skill')
      .where('skill.id IN (:...keys)', { keys })
      .getMany();
  });
