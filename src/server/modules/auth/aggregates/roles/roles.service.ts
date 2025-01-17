import { UserInputError, EntityNotFoundError, validateQuery, ensurePermission, validateOperation, logger } from '@app/core';
import * as yup from 'yup';
import { PERMISSIONS, RolesService, roleRepository } from '@app/auth';
import admin from 'firebase-admin';
import replace from 'lodash/replace';

const roleNameRegex = /^[a-zA-Z0-9-]*$/;
const roleService: RolesService = {
  setup: (app, path) => {
    app.get(path + '/customs/get-all', roleService.getAll);
  },
  find: async (params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.ROLES.VIEW);

    // 2. validate
    validateQuery(params.query);

    // 3. do business logic

    // 4. persist to db
    return await params.repository.find(params.query);
  },
  get: async (id, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.ROLES.VIEW);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }

    // 3. do business logic

    // 4. persist to db
    return await params.repository.findById(id);
  },
  create: async (data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.ROLES.CREATE);

    // 2. validate
    const validationSchema = yup.object().shape({
      name: yup.string().min(2, 'Name too short').max(50, 'Name too long').matches(roleNameRegex).required('Name is required'),
      description: yup.string().required('Description is required'),
      permissions: yup.array().required('Permissions is required'),
    });
    await validationSchema.validate(data);
    const existedRole = await params.repository.findOne({name: data.name});
    if (existedRole) {
      throw new UserInputError('Role name already exist');
    }

    // 3. do business logic

    // 4. persist to db
    const id = await params.repository.create({
      ...data,
      ...params.creationInfo,
    });

    return {
      id,
    };
  },
  patch: async (id, data, params) => {
    validateOperation(data.operation, ['updateDetail', 'activate', 'deactivate']);
    await roleService[data.operation](id, data.payload, params);
    return {};
  },
  updateDetail: async (id, data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.ROLES.EDIT);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }
    const existedRole = await params.repository.findById(id);
    if (!existedRole) {
      throw new EntityNotFoundError('Role');
    }
    const validationSchema = yup.object().shape({
      name: yup.string().min(2, 'Name too short').max(50, 'Name too long').matches(roleNameRegex),
      description: yup.string(),
      permissions: yup.array(),
    });
    await validationSchema.validate(data);

    // 3. do business logic
    // TODO: if permissions is updated => find all user with this role and update their firebase token

    // 4. persist to db
    await params.repository.update({
      id,
      ...data,
      ...params.modificationInfo,
    });

    return {};
  },
  activate: async (id, _data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.ROLES.EDIT);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }
    const existedRole = await params.repository.findById(id);
    if (!existedRole) {
      throw new EntityNotFoundError('Role');
    }

    // 3. do business logic

    // 4. persist to db
    await params.repository.update({
      id,
      isActive: true,
      ...params.modificationInfo,
    });

    return {};
  },
  deactivate: async (id, _data, params) => {
    // 1. authorize
    ensurePermission(params.authUser, PERMISSIONS.ROLES.EDIT);

    // 2. validate
    if (!id) {
      throw new UserInputError('Invalid query params');
    }
    const existedRole = await params.repository.findById(id);
    if (!existedRole) {
      throw new EntityNotFoundError('Role');
    }

    // 3. do business logic

    // 4. persist to db
    await params.repository.update({
      id,
      isActive: false,
      ...params.modificationInfo,
    });

    return {};
  },
  getAll: async (req, res) => {
    try {
      const idToken = replace(req.headers.authorization || req.cookies.token ? req.headers.authorization || req.cookies.token : '', 'Bearer ', '');
      await admin.auth().verifyIdToken(idToken);

      const roles = await roleRepository.findAll();
      res.status(200).json({
        roles,
      });
    } catch (error) {
      logger.error(error);
      res.status(error.status || 500).end(error.message || 'Internal server error');
    }
  },
};

export default roleService;
