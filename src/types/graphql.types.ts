import { Request, Response } from 'express';
import * as DataLoader from 'dataloader';
import { BoardLike } from '../boards/board-like/entities/board-like.entitiy';
import { BoardComment } from '../boards/board-comment/entities/board-comment.entity';
import { User } from '../users/auth/entities/user.entitiy';
import { Sns } from '../users/auth/entities/sns.entity';
import { Detail } from '../users/auth/entities/detail.entity';
import { UserSubscription } from '../users/user-subscription/user-subscription.entity';
import { UserSkill } from '../users/user-skill/user-skill.entity';
import { Skill } from '../users/skill/skill.entitiy';

export interface IGraphQLContext {
  req: Request;
  res: Response;
  boardLikeLoader: DataLoader<string, BoardLike[]>;
  boardCommentLoader: DataLoader<string, BoardComment[]>;
  userLoader: DataLoader<string, User[]>;
  snsLoader: DataLoader<string, Sns[]>;
  detailLoader: DataLoader<string, Detail[]>;
  subscriberLoader: DataLoader<string, UserSubscription[]>;
  subscribedToLoader: DataLoader<string, UserSubscription[]>;
  userSkillLoader: DataLoader<string, UserSkill[]>
  skillsLoader: DataLoader<string, Skill[]>
}
