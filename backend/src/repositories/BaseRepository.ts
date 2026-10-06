import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(item: any): Promise<T>;
  findById(id: string, projection?: any, options?: QueryOptions): Promise<T | null>;
  findOne(filter: FilterQuery<T>, projection?: any, options?: QueryOptions): Promise<T | null>;
  find(filter: FilterQuery<T>, projection?: any, options?: QueryOptions): Promise<T[]>;
  update(id: string, update: UpdateQuery<T>, options?: QueryOptions): Promise<T | null>;
  softDelete(id: string): Promise<boolean>;
  hardDelete(id: string): Promise<boolean>;
  findWithPagination(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    sort?: any,
    projection?: any
  ): Promise<{ items: T[]; total: number; pages: number; page: number; limit: number }>;
}

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(item: any): Promise<T> {
    return this.model.create(item);
  }

  async findById(id: string, projection?: any, options?: QueryOptions): Promise<T | null> {
    return this.model.findOne({ _id: id, deletedAt: null } as FilterQuery<T>, projection, options).exec();
  }

  async findOne(filter: FilterQuery<T>, projection?: any, options?: QueryOptions): Promise<T | null> {
    return this.model.findOne({ ...filter, deletedAt: null } as FilterQuery<T>, projection, options).exec();
  }

  async find(filter: FilterQuery<T>, projection?: any, options?: QueryOptions): Promise<T[]> {
    return this.model.find({ ...filter, deletedAt: null } as FilterQuery<T>, projection, options).exec();
  }

  async update(id: string, update: UpdateQuery<T>, options: QueryOptions = { new: true }): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { _id: id, deletedAt: null } as FilterQuery<T>,
      update,
      options
    ).exec();
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.model.updateOne(
      { _id: id, deletedAt: null } as FilterQuery<T>,
      { deletedAt: new Date() } as UpdateQuery<T>
    ).exec();
    return result.modifiedCount > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id } as FilterQuery<T>).exec();
    return result.deletedCount > 0;
  }

  async findWithPagination(
    filter: FilterQuery<T>,
    page = 1,
    limit = 10,
    sort: any = { createdAt: -1 },
    projection?: any
  ): Promise<{ items: T[]; total: number; pages: number; page: number; limit: number }> {
    const activeFilter = { ...filter, deletedAt: null } as FilterQuery<T>;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.find(activeFilter, projection).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(activeFilter).exec()
    ]);

    const pages = Math.ceil(total / limit);

    return {
      items,
      total,
      pages,
      page,
      limit
    };
  }
}
