import { ListMachinesData, ListMachinesByBuildingData, ListMachinesByBuildingVariables, GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables, GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables, GetMyUserAccountData, CreateMyUserAccountData, CreateMyUserAccountVariables, UpdateMyBuildingData, UpdateMyBuildingVariables, OccupyMachineData, OccupyMachineVariables, ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListMachines(options?: useDataConnectQueryOptions<ListMachinesData>): UseDataConnectQueryResult<ListMachinesData, undefined>;
export function useListMachines(dc: DataConnect, options?: useDataConnectQueryOptions<ListMachinesData>): UseDataConnectQueryResult<ListMachinesData, undefined>;

export function useListMachinesByBuilding(vars: ListMachinesByBuildingVariables, options?: useDataConnectQueryOptions<ListMachinesByBuildingData>): UseDataConnectQueryResult<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
export function useListMachinesByBuilding(dc: DataConnect, vars: ListMachinesByBuildingVariables, options?: useDataConnectQueryOptions<ListMachinesByBuildingData>): UseDataConnectQueryResult<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;

export function useGetMachineActiveSessionOwner(vars: GetMachineActiveSessionOwnerVariables, options?: useDataConnectQueryOptions<GetMachineActiveSessionOwnerData>): UseDataConnectQueryResult<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;
export function useGetMachineActiveSessionOwner(dc: DataConnect, vars: GetMachineActiveSessionOwnerVariables, options?: useDataConnectQueryOptions<GetMachineActiveSessionOwnerData>): UseDataConnectQueryResult<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;

export function useGetMyActiveMachineSession(vars: GetMyActiveMachineSessionVariables, options?: useDataConnectQueryOptions<GetMyActiveMachineSessionData>): UseDataConnectQueryResult<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;
export function useGetMyActiveMachineSession(dc: DataConnect, vars: GetMyActiveMachineSessionVariables, options?: useDataConnectQueryOptions<GetMyActiveMachineSessionData>): UseDataConnectQueryResult<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;

export function useGetMyUserAccount(options?: useDataConnectQueryOptions<GetMyUserAccountData>): UseDataConnectQueryResult<GetMyUserAccountData, undefined>;
export function useGetMyUserAccount(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyUserAccountData>): UseDataConnectQueryResult<GetMyUserAccountData, undefined>;

export function useCreateMyUserAccount(options?: useDataConnectMutationOptions<CreateMyUserAccountData, FirebaseError, CreateMyUserAccountVariables>): UseDataConnectMutationResult<CreateMyUserAccountData, CreateMyUserAccountVariables>;
export function useCreateMyUserAccount(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMyUserAccountData, FirebaseError, CreateMyUserAccountVariables>): UseDataConnectMutationResult<CreateMyUserAccountData, CreateMyUserAccountVariables>;

export function useUpdateMyBuilding(options?: useDataConnectMutationOptions<UpdateMyBuildingData, FirebaseError, UpdateMyBuildingVariables>): UseDataConnectMutationResult<UpdateMyBuildingData, UpdateMyBuildingVariables>;
export function useUpdateMyBuilding(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyBuildingData, FirebaseError, UpdateMyBuildingVariables>): UseDataConnectMutationResult<UpdateMyBuildingData, UpdateMyBuildingVariables>;

export function useOccupyMachine(options?: useDataConnectMutationOptions<OccupyMachineData, FirebaseError, OccupyMachineVariables>): UseDataConnectMutationResult<OccupyMachineData, OccupyMachineVariables>;
export function useOccupyMachine(dc: DataConnect, options?: useDataConnectMutationOptions<OccupyMachineData, FirebaseError, OccupyMachineVariables>): UseDataConnectMutationResult<OccupyMachineData, OccupyMachineVariables>;

export function useForceCancelMyMachineSession(options?: useDataConnectMutationOptions<ForceCancelMyMachineSessionData, FirebaseError, ForceCancelMyMachineSessionVariables>): UseDataConnectMutationResult<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;
export function useForceCancelMyMachineSession(dc: DataConnect, options?: useDataConnectMutationOptions<ForceCancelMyMachineSessionData, FirebaseError, ForceCancelMyMachineSessionVariables>): UseDataConnectMutationResult<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;
