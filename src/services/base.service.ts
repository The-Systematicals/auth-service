import { BaseRepository } from '../repositories';
import { OptionTransformer } from '../transformers';
import { BaseServiceType } from '../types/services.type';
import { ErrorConflict, ErrorNotFound, HTTP_ERROR } from '../utils';

export class BaseService<T extends Record<string, any>> implements BaseServiceType<T> {
  constructor(
    private baseRepository: BaseRepository<T>,
    private transformer?: {
      transform: (data: T) => Partial<T>;
      transformMany: (data: T[]) => Partial<T>[];
    },
  ) {}
  async create(condition: Record<string, any>, data: Partial<T>): Promise<Partial<T>> {
    const checkIfExist = await this.baseRepository.select(condition);

    if ((Array.isArray(checkIfExist) && checkIfExist.length) || checkIfExist)
      throw new ErrorConflict(HTTP_ERROR.CONFLICT.msg);

    const res = await this.baseRepository.insert(data);
    return this.transformer ? this.transformer.transform(res) : res;
  }

  async find(condition: Record<string, any>): Promise<Partial<T>> {
    const res = await this.baseRepository.select(condition);
    if ((Array.isArray(res) && !res.length) || !res) throw new ErrorNotFound(HTTP_ERROR.NOT_FOUND.msg);
    return this.transformer ? this.transformer.transform(res) : res;
  }

  async findAll(): Promise<Partial<T>[]> {
    const res = await this.baseRepository.selectAll();
    return this.transformer ? this.transformer.transformMany(res) : res;
  }

  async edit(condition: Record<string, any>, data: Partial<T>): Promise<Partial<T>> {
    const checkIfExist = await this.baseRepository.select(condition);
    if (!checkIfExist) throw new ErrorNotFound(HTTP_ERROR.NOT_FOUND.msg);
    const res = await this.baseRepository.update({ id: condition.id }, data);
    return this.transformer ? this.transformer.transform(res) : res;
  }

  async remove(id: string | number): Promise<boolean> {
    const checkIfExist = await this.baseRepository.select({ id });
    if (!checkIfExist) throw new ErrorNotFound(HTTP_ERROR.NOT_FOUND.msg);
    return await this.baseRepository.delete(id);
  }

  async option(fieldSelected: keyof T, condition: Record<string, any>): Promise<Partial<T>[]> {
    const res = await this.baseRepository.selectOption(fieldSelected, condition);
    const transformer = new OptionTransformer<T>();
    return transformer.transformMany(res);
  }
}
