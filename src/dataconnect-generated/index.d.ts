import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum DormBuilding {
  BUILDING_F = "BUILDING_F",
  BUILDING_E = "BUILDING_E",
  BUILDING_G = "BUILDING_G",
};

export enum MachineType {
  WASHER = "WASHER",
  DRYER = "DRYER",
};



export interface CreateMyUserAccountData {
  userAccount_insert: UserAccount_Key;
}

export interface CreateMyUserAccountVariables {
  dormBuilding: DormBuilding;
}

export interface GetMyUserAccountData {
  userAccount?: {
    uid: string;
    email: string;
    dormBuilding: DormBuilding;
  } & UserAccount_Key;
}

export interface LaundryActivity_Key {
  id: UUIDString;
  __typename?: 'LaundryActivity_Key';
}

export interface ListMachinesByBuildingData {
  machines: ({
    id: UUIDString;
    type: MachineType;
    dormBuilding: DormBuilding;
  } & Machine_Key)[];
}

export interface ListMachinesByBuildingVariables {
  dormBuilding: DormBuilding;
}

export interface ListMachinesData {
  machines: ({
    id: UUIDString;
    type: MachineType;
    dormBuilding: DormBuilding;
  } & Machine_Key)[];
}

export interface Machine_Key {
  id: UUIDString;
  __typename?: 'Machine_Key';
}

export interface UserAccount_Key {
  uid: string;
  __typename?: 'UserAccount_Key';
}

interface ListMachinesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMachinesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMachinesData, undefined>;
  operationName: string;
}
export const listMachinesRef: ListMachinesRef;

export function listMachines(options?: ExecuteQueryOptions): QueryPromise<ListMachinesData, undefined>;
export function listMachines(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMachinesData, undefined>;

interface ListMachinesByBuildingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMachinesByBuildingVariables): QueryRef<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListMachinesByBuildingVariables): QueryRef<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
  operationName: string;
}
export const listMachinesByBuildingRef: ListMachinesByBuildingRef;

export function listMachinesByBuilding(vars: ListMachinesByBuildingVariables, options?: ExecuteQueryOptions): QueryPromise<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
export function listMachinesByBuilding(dc: DataConnect, vars: ListMachinesByBuildingVariables, options?: ExecuteQueryOptions): QueryPromise<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;

interface GetMyUserAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyUserAccountData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyUserAccountData, undefined>;
  operationName: string;
}
export const getMyUserAccountRef: GetMyUserAccountRef;

export function getMyUserAccount(options?: ExecuteQueryOptions): QueryPromise<GetMyUserAccountData, undefined>;
export function getMyUserAccount(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyUserAccountData, undefined>;

interface CreateMyUserAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMyUserAccountVariables): MutationRef<CreateMyUserAccountData, CreateMyUserAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMyUserAccountVariables): MutationRef<CreateMyUserAccountData, CreateMyUserAccountVariables>;
  operationName: string;
}
export const createMyUserAccountRef: CreateMyUserAccountRef;

export function createMyUserAccount(vars: CreateMyUserAccountVariables): MutationPromise<CreateMyUserAccountData, CreateMyUserAccountVariables>;
export function createMyUserAccount(dc: DataConnect, vars: CreateMyUserAccountVariables): MutationPromise<CreateMyUserAccountData, CreateMyUserAccountVariables>;

