import { ListMachinesData, ListMachinesByBuildingData, ListMachinesByBuildingVariables, GetMyUserAccountData, CreateMyUserAccountData, CreateMyUserAccountVariables, UpdateMyBuildingData, UpdateMyBuildingVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListMachines(options?: useDataConnectQueryOptions<ListMachinesData>): UseDataConnectQueryResult<ListMachinesData, undefined>;
export function useListMachines(dc: DataConnect, options?: useDataConnectQueryOptions<ListMachinesData>): UseDataConnectQueryResult<ListMachinesData, undefined>;

export function useListMachinesByBuilding(vars: ListMachinesByBuildingVariables, options?: useDataConnectQueryOptions<ListMachinesByBuildingData>): UseDataConnectQueryResult<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
export function useListMachinesByBuilding(dc: DataConnect, vars: ListMachinesByBuildingVariables, options?: useDataConnectQueryOptions<ListMachinesByBuildingData>): UseDataConnectQueryResult<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;

export function useGetMyUserAccount(options?: useDataConnectQueryOptions<GetMyUserAccountData>): UseDataConnectQueryResult<GetMyUserAccountData, undefined>;
export function useGetMyUserAccount(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyUserAccountData>): UseDataConnectQueryResult<GetMyUserAccountData, undefined>;

export function useCreateMyUserAccount(options?: useDataConnectMutationOptions<CreateMyUserAccountData, FirebaseError, CreateMyUserAccountVariables>): UseDataConnectMutationResult<CreateMyUserAccountData, CreateMyUserAccountVariables>;
export function useCreateMyUserAccount(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMyUserAccountData, FirebaseError, CreateMyUserAccountVariables>): UseDataConnectMutationResult<CreateMyUserAccountData, CreateMyUserAccountVariables>;

export function useUpdateMyBuilding(options?: useDataConnectMutationOptions<UpdateMyBuildingData, FirebaseError, UpdateMyBuildingVariables>): UseDataConnectMutationResult<UpdateMyBuildingData, UpdateMyBuildingVariables>;
export function useUpdateMyBuilding(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyBuildingData, FirebaseError, UpdateMyBuildingVariables>): UseDataConnectMutationResult<UpdateMyBuildingData, UpdateMyBuildingVariables>;
