import * as DataLoader from 'dataloader';
import { getRepository } from 'typeorm';
import { Detail } from '../users/auth/entities/detail.entity';

export const DetailLoader = () =>
  new DataLoader(async (keys: string[]) => {
    console.log(keys, 'keys');
    const results = await getRepository(Detail)
      .createQueryBuilder('detail')
      .where('detail.userId IN (:...keys)', { keys })
      .getMany();
    return keys.map((key) => results.find((result) => result.userId === key));
  });
