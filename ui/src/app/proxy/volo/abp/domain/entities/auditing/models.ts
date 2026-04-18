import type { AggregateRoot } from '../models';

export interface AuditedAggregateRoot<TKey> extends CreationAuditedAggregateRoot<TKey> {
  lastModificationTime?: string | null;
  lastModifierId?: string | null;
}

export interface CreationAuditedAggregateRoot<TKey> extends AggregateRoot<TKey> {
  creationTime?: string;
  creatorId?: string | null;
}

export interface FullAuditedAggregateRoot<TKey> extends AuditedAggregateRoot<TKey> {
  isDeleted?: boolean;
  deleterId?: string | null;
  deletionTime?: string | null;
}
