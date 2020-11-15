import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { UserSkill } from '../users/user-skill/user-skill.entity';

export const UserSkillLoader = () =>
  new DataLoader(async (keys: string[]) => {
    const results = await getRepository(UserSkill)
      .createQueryBuilder('userSkill')
      .where('userSkill.userId IN (:...keys)', { keys })
      .getMany();
    return keys.map((key) => results.filter((result) => result.userId === key));
  });
