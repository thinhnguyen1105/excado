import * as mongoose from 'mongoose';
import { addAuditableSchema, addDeletableSchema, NotImplementedError, execCursorPaging } from '@app/core';
import { RolesRepository } from '@app/auth';

const RoleSchema = new mongoose.Schema(addAuditableSchema(addDeletableSchema({
  name: String,
  description: String,
  permissions: [String],
  isDefault: Boolean,
  isActive: {
    type: Boolean,
    default: true,
  },
})));
RoleSchema.index({name: 'text'});
export const RoleModel = mongoose.model('Role', RoleSchema);

export const roleRepository: RolesRepository = {
  findAll: async () => {
    return await RoleModel.find().select('_id name').exec() as any;
  },
  findById: async (id) => {
    return RoleModel.findById(id).exec() as any;
  },
  findOne: async (query: {name?: string}) => {
    return RoleModel.findOne({ name: query.name }).exec() as any;
  },
  find: async (query) => {
    const filters: any[] = [];
    if (query.search) {
      filters.push({ $text: { $search: `"${query.search}"` } });
    }
    if (query.permissions) {
      filters.push({
        permissions: { $all: query.permissions },
      });
    }

    return await execCursorPaging(
      RoleModel,
      filters,
      query.sortBy,
      Number(query.first),
      [],
      query.before,
      query.after,
    );
  },
  count: async (_query) => {
    throw new NotImplementedError();
  },
  create: async (payload) => {
    const newRole = new RoleModel(payload);
    await newRole.save();
    return newRole.id;
  },
  update: async (payload) => {
    await RoleModel.findByIdAndUpdate(payload.id, { $set: payload }).exec();
  },
  del: async (_id): Promise<void> => {
    throw new NotImplementedError();
  },
  ensureIndexes: async () => {
    await RoleModel.createIndexes();
  },
  findByIds: async (ids) => {
    return RoleModel.find({ _id: { $in: ids } }).exec() as any;
  },
  findDefaultRoles: async () => {
    return RoleModel.find({ isDefault: true }) as any;
  },
};
