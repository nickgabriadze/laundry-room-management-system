# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMachines*](#listmachines)
  - [*ListMachinesByBuilding*](#listmachinesbybuilding)
  - [*GetMachineActiveSessionOwner*](#getmachineactivesessionowner)
  - [*GetMyActiveMachineSession*](#getmyactivemachinesession)
  - [*GetMyUserAccount*](#getmyuseraccount)
  - [*GetSessionForReminderScheduling*](#getsessionforreminderscheduling)
- [**Mutations**](#mutations)
  - [*CreateMyUserAccount*](#createmyuseraccount)
  - [*UpdateMyBuilding*](#updatemybuilding)
  - [*OccupyMachine*](#occupymachine)
  - [*ForceCancelMyMachineSession*](#forcecancelmymachinesession)
  - [*SaveSessionReminderEmailId*](#savesessionreminderemailid)

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListMachines
You can execute the `ListMachines` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMachines(dc: DataConnect, options?: useDataConnectQueryOptions<ListMachinesData>): UseDataConnectQueryResult<ListMachinesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMachines(options?: useDataConnectQueryOptions<ListMachinesData>): UseDataConnectQueryResult<ListMachinesData, undefined>;
```

### Variables
The `ListMachines` Query has no variables.
### Return Type
Recall that calling the `ListMachines` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMachines` Query is of type `ListMachinesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListMachinesData {
  machines: ({
    id: UUIDString;
    type: MachineType;
    dormBuilding: DormBuilding;
  } & Machine_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMachines`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListMachines } from '@dataconnect/generated/react'

export default function ListMachinesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMachines();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMachines(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMachines(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMachines(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.machines);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMachinesByBuilding
You can execute the `ListMachinesByBuilding` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMachinesByBuilding(dc: DataConnect, vars: ListMachinesByBuildingVariables, options?: useDataConnectQueryOptions<ListMachinesByBuildingData>): UseDataConnectQueryResult<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMachinesByBuilding(vars: ListMachinesByBuildingVariables, options?: useDataConnectQueryOptions<ListMachinesByBuildingData>): UseDataConnectQueryResult<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
```

### Variables
The `ListMachinesByBuilding` Query requires an argument of type `ListMachinesByBuildingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListMachinesByBuildingVariables {
  dormBuilding: DormBuilding;
}
```
### Return Type
Recall that calling the `ListMachinesByBuilding` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMachinesByBuilding` Query is of type `ListMachinesByBuildingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ListMachinesByBuildingData {
  machines: ({
    id: UUIDString;
    machineCode?: string | null;
    type: MachineType;
    dormBuilding: DormBuilding;
    activeSessions: ({
      id: UUIDString;
      endsAt: TimestampString;
      user: {
        uid: string;
      } & UserAccount_Key;
    } & LaundryActivity_Key)[];
  } & Machine_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMachinesByBuilding`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListMachinesByBuildingVariables } from '@dataconnect/generated';
import { useListMachinesByBuilding } from '@dataconnect/generated/react'

export default function ListMachinesByBuildingComponent() {
  // The `useListMachinesByBuilding` Query hook requires an argument of type `ListMachinesByBuildingVariables`:
  const listMachinesByBuildingVars: ListMachinesByBuildingVariables = {
    dormBuilding: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMachinesByBuilding(listMachinesByBuildingVars);
  // Variables can be defined inline as well.
  const query = useListMachinesByBuilding({ dormBuilding: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMachinesByBuilding(dataConnect, listMachinesByBuildingVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMachinesByBuilding(listMachinesByBuildingVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMachinesByBuilding(dataConnect, listMachinesByBuildingVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.machines);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMachineActiveSessionOwner
You can execute the `GetMachineActiveSessionOwner` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMachineActiveSessionOwner(dc: DataConnect, vars: GetMachineActiveSessionOwnerVariables, options?: useDataConnectQueryOptions<GetMachineActiveSessionOwnerData>): UseDataConnectQueryResult<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMachineActiveSessionOwner(vars: GetMachineActiveSessionOwnerVariables, options?: useDataConnectQueryOptions<GetMachineActiveSessionOwnerData>): UseDataConnectQueryResult<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;
```

### Variables
The `GetMachineActiveSessionOwner` Query requires an argument of type `GetMachineActiveSessionOwnerVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetMachineActiveSessionOwnerVariables {
  machineId: UUIDString;
}
```
### Return Type
Recall that calling the `GetMachineActiveSessionOwner` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMachineActiveSessionOwner` Query is of type `GetMachineActiveSessionOwnerData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetMachineActiveSessionOwnerData {
  laundryActivities: ({
    user: {
      email: string;
    };
  })[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMachineActiveSessionOwner`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetMachineActiveSessionOwnerVariables } from '@dataconnect/generated';
import { useGetMachineActiveSessionOwner } from '@dataconnect/generated/react'

export default function GetMachineActiveSessionOwnerComponent() {
  // The `useGetMachineActiveSessionOwner` Query hook requires an argument of type `GetMachineActiveSessionOwnerVariables`:
  const getMachineActiveSessionOwnerVars: GetMachineActiveSessionOwnerVariables = {
    machineId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMachineActiveSessionOwner(getMachineActiveSessionOwnerVars);
  // Variables can be defined inline as well.
  const query = useGetMachineActiveSessionOwner({ machineId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMachineActiveSessionOwner(dataConnect, getMachineActiveSessionOwnerVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMachineActiveSessionOwner(getMachineActiveSessionOwnerVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMachineActiveSessionOwner(dataConnect, getMachineActiveSessionOwnerVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.laundryActivities);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyActiveMachineSession
You can execute the `GetMyActiveMachineSession` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMyActiveMachineSession(dc: DataConnect, vars: GetMyActiveMachineSessionVariables, options?: useDataConnectQueryOptions<GetMyActiveMachineSessionData>): UseDataConnectQueryResult<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyActiveMachineSession(vars: GetMyActiveMachineSessionVariables, options?: useDataConnectQueryOptions<GetMyActiveMachineSessionData>): UseDataConnectQueryResult<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;
```

### Variables
The `GetMyActiveMachineSession` Query requires an argument of type `GetMyActiveMachineSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetMyActiveMachineSessionVariables {
  machineId: UUIDString;
}
```
### Return Type
Recall that calling the `GetMyActiveMachineSession` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyActiveMachineSession` Query is of type `GetMyActiveMachineSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetMyActiveMachineSessionData {
  laundryActivities: ({
    id: UUIDString;
    endsAt: TimestampString;
    scheduledReminderEmailId?: string | null;
  } & LaundryActivity_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyActiveMachineSession`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetMyActiveMachineSessionVariables } from '@dataconnect/generated';
import { useGetMyActiveMachineSession } from '@dataconnect/generated/react'

export default function GetMyActiveMachineSessionComponent() {
  // The `useGetMyActiveMachineSession` Query hook requires an argument of type `GetMyActiveMachineSessionVariables`:
  const getMyActiveMachineSessionVars: GetMyActiveMachineSessionVariables = {
    machineId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyActiveMachineSession(getMyActiveMachineSessionVars);
  // Variables can be defined inline as well.
  const query = useGetMyActiveMachineSession({ machineId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyActiveMachineSession(dataConnect, getMyActiveMachineSessionVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyActiveMachineSession(getMyActiveMachineSessionVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyActiveMachineSession(dataConnect, getMyActiveMachineSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.laundryActivities);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetMyUserAccount
You can execute the `GetMyUserAccount` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetMyUserAccount(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyUserAccountData>): UseDataConnectQueryResult<GetMyUserAccountData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetMyUserAccount(options?: useDataConnectQueryOptions<GetMyUserAccountData>): UseDataConnectQueryResult<GetMyUserAccountData, undefined>;
```

### Variables
The `GetMyUserAccount` Query has no variables.
### Return Type
Recall that calling the `GetMyUserAccount` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetMyUserAccount` Query is of type `GetMyUserAccountData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetMyUserAccountData {
  userAccount?: {
    uid: string;
    email: string;
    dormBuilding: DormBuilding;
    buildingUpdatedAt?: TimestampString | null;
  } & UserAccount_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetMyUserAccount`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useGetMyUserAccount } from '@dataconnect/generated/react'

export default function GetMyUserAccountComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetMyUserAccount();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetMyUserAccount(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyUserAccount(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetMyUserAccount(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userAccount);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetSessionForReminderScheduling
You can execute the `GetSessionForReminderScheduling` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetSessionForReminderScheduling(dc: DataConnect, vars: GetSessionForReminderSchedulingVariables, options?: useDataConnectQueryOptions<GetSessionForReminderSchedulingData>): UseDataConnectQueryResult<GetSessionForReminderSchedulingData, GetSessionForReminderSchedulingVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetSessionForReminderScheduling(vars: GetSessionForReminderSchedulingVariables, options?: useDataConnectQueryOptions<GetSessionForReminderSchedulingData>): UseDataConnectQueryResult<GetSessionForReminderSchedulingData, GetSessionForReminderSchedulingVariables>;
```

### Variables
The `GetSessionForReminderScheduling` Query requires an argument of type `GetSessionForReminderSchedulingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetSessionForReminderSchedulingVariables {
  activityId: UUIDString;
}
```
### Return Type
Recall that calling the `GetSessionForReminderScheduling` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetSessionForReminderScheduling` Query is of type `GetSessionForReminderSchedulingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetSessionForReminderSchedulingData {
  laundryActivity?: {
    id: UUIDString;
    endsAt: TimestampString;
    wasForceCancelled: boolean;
    scheduledReminderEmailId?: string | null;
    machine: {
      id: UUIDString;
      machineCode?: string | null;
      type: MachineType;
    } & Machine_Key;
    user: {
      uid: string;
      email: string;
    } & UserAccount_Key;
  } & LaundryActivity_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetSessionForReminderScheduling`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetSessionForReminderSchedulingVariables } from '@dataconnect/generated';
import { useGetSessionForReminderScheduling } from '@dataconnect/generated/react'

export default function GetSessionForReminderSchedulingComponent() {
  // The `useGetSessionForReminderScheduling` Query hook requires an argument of type `GetSessionForReminderSchedulingVariables`:
  const getSessionForReminderSchedulingVars: GetSessionForReminderSchedulingVariables = {
    activityId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetSessionForReminderScheduling(getSessionForReminderSchedulingVars);
  // Variables can be defined inline as well.
  const query = useGetSessionForReminderScheduling({ activityId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetSessionForReminderScheduling(dataConnect, getSessionForReminderSchedulingVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetSessionForReminderScheduling(getSessionForReminderSchedulingVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetSessionForReminderScheduling(dataConnect, getSessionForReminderSchedulingVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.laundryActivity);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateMyUserAccount
You can execute the `CreateMyUserAccount` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateMyUserAccount(options?: useDataConnectMutationOptions<CreateMyUserAccountData, FirebaseError, CreateMyUserAccountVariables>): UseDataConnectMutationResult<CreateMyUserAccountData, CreateMyUserAccountVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateMyUserAccount(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMyUserAccountData, FirebaseError, CreateMyUserAccountVariables>): UseDataConnectMutationResult<CreateMyUserAccountData, CreateMyUserAccountVariables>;
```

### Variables
The `CreateMyUserAccount` Mutation requires an argument of type `CreateMyUserAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateMyUserAccountVariables {
  dormBuilding: DormBuilding;
}
```
### Return Type
Recall that calling the `CreateMyUserAccount` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateMyUserAccount` Mutation is of type `CreateMyUserAccountData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateMyUserAccountData {
  userAccount_insert: UserAccount_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateMyUserAccount`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateMyUserAccountVariables } from '@dataconnect/generated';
import { useCreateMyUserAccount } from '@dataconnect/generated/react'

export default function CreateMyUserAccountComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateMyUserAccount();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateMyUserAccount(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateMyUserAccount(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateMyUserAccount(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateMyUserAccount` Mutation requires an argument of type `CreateMyUserAccountVariables`:
  const createMyUserAccountVars: CreateMyUserAccountVariables = {
    dormBuilding: ..., 
  };
  mutation.mutate(createMyUserAccountVars);
  // Variables can be defined inline as well.
  mutation.mutate({ dormBuilding: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createMyUserAccountVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userAccount_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateMyBuilding
You can execute the `UpdateMyBuilding` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateMyBuilding(options?: useDataConnectMutationOptions<UpdateMyBuildingData, FirebaseError, UpdateMyBuildingVariables>): UseDataConnectMutationResult<UpdateMyBuildingData, UpdateMyBuildingVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateMyBuilding(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMyBuildingData, FirebaseError, UpdateMyBuildingVariables>): UseDataConnectMutationResult<UpdateMyBuildingData, UpdateMyBuildingVariables>;
```

### Variables
The `UpdateMyBuilding` Mutation requires an argument of type `UpdateMyBuildingVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateMyBuildingVariables {
  dormBuilding: DormBuilding;
}
```
### Return Type
Recall that calling the `UpdateMyBuilding` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateMyBuilding` Mutation is of type `UpdateMyBuildingData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateMyBuildingData {
  userAccount_update?: UserAccount_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateMyBuilding`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateMyBuildingVariables } from '@dataconnect/generated';
import { useUpdateMyBuilding } from '@dataconnect/generated/react'

export default function UpdateMyBuildingComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateMyBuilding();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateMyBuilding(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyBuilding(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateMyBuilding(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateMyBuilding` Mutation requires an argument of type `UpdateMyBuildingVariables`:
  const updateMyBuildingVars: UpdateMyBuildingVariables = {
    dormBuilding: ..., 
  };
  mutation.mutate(updateMyBuildingVars);
  // Variables can be defined inline as well.
  mutation.mutate({ dormBuilding: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateMyBuildingVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userAccount_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## OccupyMachine
You can execute the `OccupyMachine` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useOccupyMachine(options?: useDataConnectMutationOptions<OccupyMachineData, FirebaseError, OccupyMachineVariables>): UseDataConnectMutationResult<OccupyMachineData, OccupyMachineVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useOccupyMachine(dc: DataConnect, options?: useDataConnectMutationOptions<OccupyMachineData, FirebaseError, OccupyMachineVariables>): UseDataConnectMutationResult<OccupyMachineData, OccupyMachineVariables>;
```

### Variables
The `OccupyMachine` Mutation requires an argument of type `OccupyMachineVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface OccupyMachineVariables {
  machineId: UUIDString;
  endsAt: TimestampString;
}
```
### Return Type
Recall that calling the `OccupyMachine` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `OccupyMachine` Mutation is of type `OccupyMachineData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface OccupyMachineData {
  machine_update?: Machine_Key | null;
  laundryActivity_insert: LaundryActivity_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `OccupyMachine`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, OccupyMachineVariables } from '@dataconnect/generated';
import { useOccupyMachine } from '@dataconnect/generated/react'

export default function OccupyMachineComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useOccupyMachine();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useOccupyMachine(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useOccupyMachine(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useOccupyMachine(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useOccupyMachine` Mutation requires an argument of type `OccupyMachineVariables`:
  const occupyMachineVars: OccupyMachineVariables = {
    machineId: ..., 
    endsAt: ..., 
  };
  mutation.mutate(occupyMachineVars);
  // Variables can be defined inline as well.
  mutation.mutate({ machineId: ..., endsAt: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(occupyMachineVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.machine_update);
    console.log(mutation.data.laundryActivity_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ForceCancelMyMachineSession
You can execute the `ForceCancelMyMachineSession` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useForceCancelMyMachineSession(options?: useDataConnectMutationOptions<ForceCancelMyMachineSessionData, FirebaseError, ForceCancelMyMachineSessionVariables>): UseDataConnectMutationResult<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useForceCancelMyMachineSession(dc: DataConnect, options?: useDataConnectMutationOptions<ForceCancelMyMachineSessionData, FirebaseError, ForceCancelMyMachineSessionVariables>): UseDataConnectMutationResult<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;
```

### Variables
The `ForceCancelMyMachineSession` Mutation requires an argument of type `ForceCancelMyMachineSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ForceCancelMyMachineSessionVariables {
  machineId: UUIDString;
}
```
### Return Type
Recall that calling the `ForceCancelMyMachineSession` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `ForceCancelMyMachineSession` Mutation is of type `ForceCancelMyMachineSessionData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface ForceCancelMyMachineSessionData {
  laundryActivity_update?: LaundryActivity_Key | null;
  machine_update?: Machine_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `ForceCancelMyMachineSession`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ForceCancelMyMachineSessionVariables } from '@dataconnect/generated';
import { useForceCancelMyMachineSession } from '@dataconnect/generated/react'

export default function ForceCancelMyMachineSessionComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useForceCancelMyMachineSession();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useForceCancelMyMachineSession(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useForceCancelMyMachineSession(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useForceCancelMyMachineSession(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useForceCancelMyMachineSession` Mutation requires an argument of type `ForceCancelMyMachineSessionVariables`:
  const forceCancelMyMachineSessionVars: ForceCancelMyMachineSessionVariables = {
    machineId: ..., 
  };
  mutation.mutate(forceCancelMyMachineSessionVars);
  // Variables can be defined inline as well.
  mutation.mutate({ machineId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(forceCancelMyMachineSessionVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.laundryActivity_update);
    console.log(mutation.data.machine_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## SaveSessionReminderEmailId
You can execute the `SaveSessionReminderEmailId` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useSaveSessionReminderEmailId(options?: useDataConnectMutationOptions<SaveSessionReminderEmailIdData, FirebaseError, SaveSessionReminderEmailIdVariables>): UseDataConnectMutationResult<SaveSessionReminderEmailIdData, SaveSessionReminderEmailIdVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useSaveSessionReminderEmailId(dc: DataConnect, options?: useDataConnectMutationOptions<SaveSessionReminderEmailIdData, FirebaseError, SaveSessionReminderEmailIdVariables>): UseDataConnectMutationResult<SaveSessionReminderEmailIdData, SaveSessionReminderEmailIdVariables>;
```

### Variables
The `SaveSessionReminderEmailId` Mutation requires an argument of type `SaveSessionReminderEmailIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SaveSessionReminderEmailIdVariables {
  activityId: UUIDString;
  emailId?: string | null;
}
```
### Return Type
Recall that calling the `SaveSessionReminderEmailId` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `SaveSessionReminderEmailId` Mutation is of type `SaveSessionReminderEmailIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface SaveSessionReminderEmailIdData {
  laundryActivity_update?: LaundryActivity_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `SaveSessionReminderEmailId`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SaveSessionReminderEmailIdVariables } from '@dataconnect/generated';
import { useSaveSessionReminderEmailId } from '@dataconnect/generated/react'

export default function SaveSessionReminderEmailIdComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useSaveSessionReminderEmailId();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useSaveSessionReminderEmailId(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useSaveSessionReminderEmailId(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useSaveSessionReminderEmailId(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useSaveSessionReminderEmailId` Mutation requires an argument of type `SaveSessionReminderEmailIdVariables`:
  const saveSessionReminderEmailIdVars: SaveSessionReminderEmailIdVariables = {
    activityId: ..., 
    emailId: ..., // optional
  };
  mutation.mutate(saveSessionReminderEmailIdVars);
  // Variables can be defined inline as well.
  mutation.mutate({ activityId: ..., emailId: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(saveSessionReminderEmailIdVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.laundryActivity_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

