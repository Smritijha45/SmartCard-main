import { BaseRepository, IBaseRepository } from '../../repositories/BaseRepository';
import { ICompanyDocument, CompanyModel } from './model';

export interface ICompanyRepository extends IBaseRepository<ICompanyDocument> {
  findByOwner(ownerId: string): Promise<ICompanyDocument | null>;
  findByDomain(domain: string): Promise<ICompanyDocument | null>;
}

export class CompanyRepository extends BaseRepository<ICompanyDocument> implements ICompanyRepository {
  constructor() {
    super(CompanyModel);
  }

  async findByOwner(ownerId: string): Promise<ICompanyDocument | null> {
    return this.findOne({ ownerId });
  }

  async findByDomain(domain: string): Promise<ICompanyDocument | null> {
    return this.findOne({ domain: domain.toLowerCase() });
  }
}
export default CompanyRepository;
