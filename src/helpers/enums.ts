export enum UserRole {
  SUPERADMIN = 'superAdmin',
  SUB_ADMIN = 'sub-admin',
  EMPLOYEE = 'employee',
  USER = 'user',
}

export enum LoginTypeEnum {
  GOOGLE = 'google',
  APPLE = 'apple',
  EMAIL = 'email',
}

export enum ReferenceCreatedBy {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ReferenceType {
  M1 = 'M1',
  M2 = 'M2',
  F1 = 'F1',
  F2 = 'F2',
}

export enum ReferenceStatus {
  DRAFT = 'draft',
  USERSAVED = 'userSaved',
  ADMINASSIGNED = 'adminAssigned',
  GLOBAL = 'global',
}

export enum MediaType {
  IMAGE = 'image',
  SIGNATURE = 'signature',
}

export enum UserRestrictionType {
  BLOCKED = 'blocked',
  RESTRICTED = 'restricted',
}
