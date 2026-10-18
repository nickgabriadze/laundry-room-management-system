# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListMachines*](#listmachines)
  - [*ListMachinesByBuilding*](#listmachinesbybuilding)
  - [*GetMachineActiveSessionOwner*](#getmachineactivesessionowner)
  - [*GetMyActiveMachineSession*](#getmyactivemachinesession)
  - [*GetMyUserAccount*](#getmyuseraccount)
- [**Mutations**](#mutations)
  - [*CreateMyUserAccount*](#createmyuseraccount)
  - [*UpdateMyBuilding*](#updatemybuilding)
  - [*OccupyMachine*](#occupymachine)
  - [*ForceCancelMyMachineSession*](#forcecancelmymachinesession)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListMachines
You can execute the `ListMachines` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMachines(options?: ExecuteQueryOptions): QueryPromise<ListMachinesData, undefined>;

interface ListMachinesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMachinesData, undefined>;
}
export const listMachinesRef: ListMachinesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMachines(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMachinesData, undefined>;

interface ListMachinesRef {
  ...
  (dc: DataConnect): QueryRef<ListMachinesData, undefined>;
}
export const listMachinesRef: ListMachinesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMachinesRef:
```typescript
const name = listMachinesRef.operationName;
console.log(name);
```

### Variables
The `ListMachines` query has no variables.
### Return Type
Recall that executing the `ListMachines` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMachinesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMachinesData {
  machines: ({
    id: UUIDString;
    type: MachineType;
    dormBuilding: DormBuilding;
  } & Machine_Key)[];
}
```
### Using `ListMachines`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMachines } from '@dataconnect/generated';


// Call the `listMachines()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMachines();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMachines(dataConnect);

console.log(data.machines);

// Or, you can use the `Promise` API.
listMachines().then((response) => {
  const data = response.data;
  console.log(data.machines);
});
```

### Using `ListMachines`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMachinesRef } from '@dataconnect/generated';


// Call the `listMachinesRef()` function to get a reference to the query.
const ref = listMachinesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMachinesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.machines);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.machines);
});
```

## ListMachinesByBuilding
You can execute the `ListMachinesByBuilding` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMachinesByBuilding(vars: ListMachinesByBuildingVariables, options?: ExecuteQueryOptions): QueryPromise<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;

interface ListMachinesByBuildingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListMachinesByBuildingVariables): QueryRef<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
}
export const listMachinesByBuildingRef: ListMachinesByBuildingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMachinesByBuilding(dc: DataConnect, vars: ListMachinesByBuildingVariables, options?: ExecuteQueryOptions): QueryPromise<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;

interface ListMachinesByBuildingRef {
  ...
  (dc: DataConnect, vars: ListMachinesByBuildingVariables): QueryRef<ListMachinesByBuildingData, ListMachinesByBuildingVariables>;
}
export const listMachinesByBuildingRef: ListMachinesByBuildingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMachinesByBuildingRef:
```typescript
const name = listMachinesByBuildingRef.operationName;
console.log(name);
```

### Variables
The `ListMachinesByBuilding` query requires an argument of type `ListMachinesByBuildingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListMachinesByBuildingVariables {
  dormBuilding: DormBuilding;
}
```
### Return Type
Recall that executing the `ListMachinesByBuilding` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMachinesByBuildingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
### Using `ListMachinesByBuilding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMachinesByBuilding, ListMachinesByBuildingVariables } from '@dataconnect/generated';

// The `ListMachinesByBuilding` query requires an argument of type `ListMachinesByBuildingVariables`:
const listMachinesByBuildingVars: ListMachinesByBuildingVariables = {
  dormBuilding: ..., 
};

// Call the `listMachinesByBuilding()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMachinesByBuilding(listMachinesByBuildingVars);
// Variables can be defined inline as well.
const { data } = await listMachinesByBuilding({ dormBuilding: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMachinesByBuilding(dataConnect, listMachinesByBuildingVars);

console.log(data.machines);

// Or, you can use the `Promise` API.
listMachinesByBuilding(listMachinesByBuildingVars).then((response) => {
  const data = response.data;
  console.log(data.machines);
});
```

### Using `ListMachinesByBuilding`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMachinesByBuildingRef, ListMachinesByBuildingVariables } from '@dataconnect/generated';

// The `ListMachinesByBuilding` query requires an argument of type `ListMachinesByBuildingVariables`:
const listMachinesByBuildingVars: ListMachinesByBuildingVariables = {
  dormBuilding: ..., 
};

// Call the `listMachinesByBuildingRef()` function to get a reference to the query.
const ref = listMachinesByBuildingRef(listMachinesByBuildingVars);
// Variables can be defined inline as well.
const ref = listMachinesByBuildingRef({ dormBuilding: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMachinesByBuildingRef(dataConnect, listMachinesByBuildingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.machines);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.machines);
});
```

## GetMachineActiveSessionOwner
You can execute the `GetMachineActiveSessionOwner` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMachineActiveSessionOwner(vars: GetMachineActiveSessionOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;

interface GetMachineActiveSessionOwnerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMachineActiveSessionOwnerVariables): QueryRef<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;
}
export const getMachineActiveSessionOwnerRef: GetMachineActiveSessionOwnerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMachineActiveSessionOwner(dc: DataConnect, vars: GetMachineActiveSessionOwnerVariables, options?: ExecuteQueryOptions): QueryPromise<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;

interface GetMachineActiveSessionOwnerRef {
  ...
  (dc: DataConnect, vars: GetMachineActiveSessionOwnerVariables): QueryRef<GetMachineActiveSessionOwnerData, GetMachineActiveSessionOwnerVariables>;
}
export const getMachineActiveSessionOwnerRef: GetMachineActiveSessionOwnerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMachineActiveSessionOwnerRef:
```typescript
const name = getMachineActiveSessionOwnerRef.operationName;
console.log(name);
```

### Variables
The `GetMachineActiveSessionOwner` query requires an argument of type `GetMachineActiveSessionOwnerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMachineActiveSessionOwnerVariables {
  machineId: UUIDString;
}
```
### Return Type
Recall that executing the `GetMachineActiveSessionOwner` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMachineActiveSessionOwnerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMachineActiveSessionOwnerData {
  laundryActivities: ({
    user: {
      email: string;
    };
  })[];
}
```
### Using `GetMachineActiveSessionOwner`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMachineActiveSessionOwner, GetMachineActiveSessionOwnerVariables } from '@dataconnect/generated';

// The `GetMachineActiveSessionOwner` query requires an argument of type `GetMachineActiveSessionOwnerVariables`:
const getMachineActiveSessionOwnerVars: GetMachineActiveSessionOwnerVariables = {
  machineId: ..., 
};

// Call the `getMachineActiveSessionOwner()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMachineActiveSessionOwner(getMachineActiveSessionOwnerVars);
// Variables can be defined inline as well.
const { data } = await getMachineActiveSessionOwner({ machineId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMachineActiveSessionOwner(dataConnect, getMachineActiveSessionOwnerVars);

console.log(data.laundryActivities);

// Or, you can use the `Promise` API.
getMachineActiveSessionOwner(getMachineActiveSessionOwnerVars).then((response) => {
  const data = response.data;
  console.log(data.laundryActivities);
});
```

### Using `GetMachineActiveSessionOwner`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMachineActiveSessionOwnerRef, GetMachineActiveSessionOwnerVariables } from '@dataconnect/generated';

// The `GetMachineActiveSessionOwner` query requires an argument of type `GetMachineActiveSessionOwnerVariables`:
const getMachineActiveSessionOwnerVars: GetMachineActiveSessionOwnerVariables = {
  machineId: ..., 
};

// Call the `getMachineActiveSessionOwnerRef()` function to get a reference to the query.
const ref = getMachineActiveSessionOwnerRef(getMachineActiveSessionOwnerVars);
// Variables can be defined inline as well.
const ref = getMachineActiveSessionOwnerRef({ machineId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMachineActiveSessionOwnerRef(dataConnect, getMachineActiveSessionOwnerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.laundryActivities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.laundryActivities);
});
```

## GetMyActiveMachineSession
You can execute the `GetMyActiveMachineSession` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyActiveMachineSession(vars: GetMyActiveMachineSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;

interface GetMyActiveMachineSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyActiveMachineSessionVariables): QueryRef<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;
}
export const getMyActiveMachineSessionRef: GetMyActiveMachineSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyActiveMachineSession(dc: DataConnect, vars: GetMyActiveMachineSessionVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;

interface GetMyActiveMachineSessionRef {
  ...
  (dc: DataConnect, vars: GetMyActiveMachineSessionVariables): QueryRef<GetMyActiveMachineSessionData, GetMyActiveMachineSessionVariables>;
}
export const getMyActiveMachineSessionRef: GetMyActiveMachineSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyActiveMachineSessionRef:
```typescript
const name = getMyActiveMachineSessionRef.operationName;
console.log(name);
```

### Variables
The `GetMyActiveMachineSession` query requires an argument of type `GetMyActiveMachineSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyActiveMachineSessionVariables {
  machineId: UUIDString;
}
```
### Return Type
Recall that executing the `GetMyActiveMachineSession` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyActiveMachineSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyActiveMachineSessionData {
  laundryActivities: ({
    id: UUIDString;
    endsAt: TimestampString;
  } & LaundryActivity_Key)[];
}
```
### Using `GetMyActiveMachineSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyActiveMachineSession, GetMyActiveMachineSessionVariables } from '@dataconnect/generated';

// The `GetMyActiveMachineSession` query requires an argument of type `GetMyActiveMachineSessionVariables`:
const getMyActiveMachineSessionVars: GetMyActiveMachineSessionVariables = {
  machineId: ..., 
};

// Call the `getMyActiveMachineSession()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyActiveMachineSession(getMyActiveMachineSessionVars);
// Variables can be defined inline as well.
const { data } = await getMyActiveMachineSession({ machineId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyActiveMachineSession(dataConnect, getMyActiveMachineSessionVars);

console.log(data.laundryActivities);

// Or, you can use the `Promise` API.
getMyActiveMachineSession(getMyActiveMachineSessionVars).then((response) => {
  const data = response.data;
  console.log(data.laundryActivities);
});
```

### Using `GetMyActiveMachineSession`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyActiveMachineSessionRef, GetMyActiveMachineSessionVariables } from '@dataconnect/generated';

// The `GetMyActiveMachineSession` query requires an argument of type `GetMyActiveMachineSessionVariables`:
const getMyActiveMachineSessionVars: GetMyActiveMachineSessionVariables = {
  machineId: ..., 
};

// Call the `getMyActiveMachineSessionRef()` function to get a reference to the query.
const ref = getMyActiveMachineSessionRef(getMyActiveMachineSessionVars);
// Variables can be defined inline as well.
const ref = getMyActiveMachineSessionRef({ machineId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyActiveMachineSessionRef(dataConnect, getMyActiveMachineSessionVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.laundryActivities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.laundryActivities);
});
```

## GetMyUserAccount
You can execute the `GetMyUserAccount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyUserAccount(options?: ExecuteQueryOptions): QueryPromise<GetMyUserAccountData, undefined>;

interface GetMyUserAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyUserAccountData, undefined>;
}
export const getMyUserAccountRef: GetMyUserAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyUserAccount(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyUserAccountData, undefined>;

interface GetMyUserAccountRef {
  ...
  (dc: DataConnect): QueryRef<GetMyUserAccountData, undefined>;
}
export const getMyUserAccountRef: GetMyUserAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyUserAccountRef:
```typescript
const name = getMyUserAccountRef.operationName;
console.log(name);
```

### Variables
The `GetMyUserAccount` query has no variables.
### Return Type
Recall that executing the `GetMyUserAccount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyUserAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyUserAccountData {
  userAccount?: {
    uid: string;
    email: string;
    dormBuilding: DormBuilding;
    buildingUpdatedAt?: TimestampString | null;
  } & UserAccount_Key;
}
```
### Using `GetMyUserAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyUserAccount } from '@dataconnect/generated';


// Call the `getMyUserAccount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyUserAccount();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyUserAccount(dataConnect);

console.log(data.userAccount);

// Or, you can use the `Promise` API.
getMyUserAccount().then((response) => {
  const data = response.data;
  console.log(data.userAccount);
});
```

### Using `GetMyUserAccount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyUserAccountRef } from '@dataconnect/generated';


// Call the `getMyUserAccountRef()` function to get a reference to the query.
const ref = getMyUserAccountRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyUserAccountRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userAccount);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userAccount);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateMyUserAccount
You can execute the `CreateMyUserAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMyUserAccount(vars: CreateMyUserAccountVariables): MutationPromise<CreateMyUserAccountData, CreateMyUserAccountVariables>;

interface CreateMyUserAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMyUserAccountVariables): MutationRef<CreateMyUserAccountData, CreateMyUserAccountVariables>;
}
export const createMyUserAccountRef: CreateMyUserAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMyUserAccount(dc: DataConnect, vars: CreateMyUserAccountVariables): MutationPromise<CreateMyUserAccountData, CreateMyUserAccountVariables>;

interface CreateMyUserAccountRef {
  ...
  (dc: DataConnect, vars: CreateMyUserAccountVariables): MutationRef<CreateMyUserAccountData, CreateMyUserAccountVariables>;
}
export const createMyUserAccountRef: CreateMyUserAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMyUserAccountRef:
```typescript
const name = createMyUserAccountRef.operationName;
console.log(name);
```

### Variables
The `CreateMyUserAccount` mutation requires an argument of type `CreateMyUserAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMyUserAccountVariables {
  dormBuilding: DormBuilding;
}
```
### Return Type
Recall that executing the `CreateMyUserAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMyUserAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMyUserAccountData {
  userAccount_insert: UserAccount_Key;
}
```
### Using `CreateMyUserAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMyUserAccount, CreateMyUserAccountVariables } from '@dataconnect/generated';

// The `CreateMyUserAccount` mutation requires an argument of type `CreateMyUserAccountVariables`:
const createMyUserAccountVars: CreateMyUserAccountVariables = {
  dormBuilding: ..., 
};

// Call the `createMyUserAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMyUserAccount(createMyUserAccountVars);
// Variables can be defined inline as well.
const { data } = await createMyUserAccount({ dormBuilding: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMyUserAccount(dataConnect, createMyUserAccountVars);

console.log(data.userAccount_insert);

// Or, you can use the `Promise` API.
createMyUserAccount(createMyUserAccountVars).then((response) => {
  const data = response.data;
  console.log(data.userAccount_insert);
});
```

### Using `CreateMyUserAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMyUserAccountRef, CreateMyUserAccountVariables } from '@dataconnect/generated';

// The `CreateMyUserAccount` mutation requires an argument of type `CreateMyUserAccountVariables`:
const createMyUserAccountVars: CreateMyUserAccountVariables = {
  dormBuilding: ..., 
};

// Call the `createMyUserAccountRef()` function to get a reference to the mutation.
const ref = createMyUserAccountRef(createMyUserAccountVars);
// Variables can be defined inline as well.
const ref = createMyUserAccountRef({ dormBuilding: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMyUserAccountRef(dataConnect, createMyUserAccountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAccount_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAccount_insert);
});
```

## UpdateMyBuilding
You can execute the `UpdateMyBuilding` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateMyBuilding(vars: UpdateMyBuildingVariables): MutationPromise<UpdateMyBuildingData, UpdateMyBuildingVariables>;

interface UpdateMyBuildingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMyBuildingVariables): MutationRef<UpdateMyBuildingData, UpdateMyBuildingVariables>;
}
export const updateMyBuildingRef: UpdateMyBuildingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateMyBuilding(dc: DataConnect, vars: UpdateMyBuildingVariables): MutationPromise<UpdateMyBuildingData, UpdateMyBuildingVariables>;

interface UpdateMyBuildingRef {
  ...
  (dc: DataConnect, vars: UpdateMyBuildingVariables): MutationRef<UpdateMyBuildingData, UpdateMyBuildingVariables>;
}
export const updateMyBuildingRef: UpdateMyBuildingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateMyBuildingRef:
```typescript
const name = updateMyBuildingRef.operationName;
console.log(name);
```

### Variables
The `UpdateMyBuilding` mutation requires an argument of type `UpdateMyBuildingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateMyBuildingVariables {
  dormBuilding: DormBuilding;
}
```
### Return Type
Recall that executing the `UpdateMyBuilding` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateMyBuildingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateMyBuildingData {
  userAccount_update?: UserAccount_Key | null;
}
```
### Using `UpdateMyBuilding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateMyBuilding, UpdateMyBuildingVariables } from '@dataconnect/generated';

// The `UpdateMyBuilding` mutation requires an argument of type `UpdateMyBuildingVariables`:
const updateMyBuildingVars: UpdateMyBuildingVariables = {
  dormBuilding: ..., 
};

// Call the `updateMyBuilding()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateMyBuilding(updateMyBuildingVars);
// Variables can be defined inline as well.
const { data } = await updateMyBuilding({ dormBuilding: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateMyBuilding(dataConnect, updateMyBuildingVars);

console.log(data.userAccount_update);

// Or, you can use the `Promise` API.
updateMyBuilding(updateMyBuildingVars).then((response) => {
  const data = response.data;
  console.log(data.userAccount_update);
});
```

### Using `UpdateMyBuilding`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateMyBuildingRef, UpdateMyBuildingVariables } from '@dataconnect/generated';

// The `UpdateMyBuilding` mutation requires an argument of type `UpdateMyBuildingVariables`:
const updateMyBuildingVars: UpdateMyBuildingVariables = {
  dormBuilding: ..., 
};

// Call the `updateMyBuildingRef()` function to get a reference to the mutation.
const ref = updateMyBuildingRef(updateMyBuildingVars);
// Variables can be defined inline as well.
const ref = updateMyBuildingRef({ dormBuilding: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateMyBuildingRef(dataConnect, updateMyBuildingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userAccount_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userAccount_update);
});
```

## OccupyMachine
You can execute the `OccupyMachine` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
occupyMachine(vars: OccupyMachineVariables): MutationPromise<OccupyMachineData, OccupyMachineVariables>;

interface OccupyMachineRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: OccupyMachineVariables): MutationRef<OccupyMachineData, OccupyMachineVariables>;
}
export const occupyMachineRef: OccupyMachineRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
occupyMachine(dc: DataConnect, vars: OccupyMachineVariables): MutationPromise<OccupyMachineData, OccupyMachineVariables>;

interface OccupyMachineRef {
  ...
  (dc: DataConnect, vars: OccupyMachineVariables): MutationRef<OccupyMachineData, OccupyMachineVariables>;
}
export const occupyMachineRef: OccupyMachineRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the occupyMachineRef:
```typescript
const name = occupyMachineRef.operationName;
console.log(name);
```

### Variables
The `OccupyMachine` mutation requires an argument of type `OccupyMachineVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface OccupyMachineVariables {
  machineId: UUIDString;
  endsAt: TimestampString;
}
```
### Return Type
Recall that executing the `OccupyMachine` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `OccupyMachineData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface OccupyMachineData {
  machine_update?: Machine_Key | null;
  laundryActivity_insert: LaundryActivity_Key;
}
```
### Using `OccupyMachine`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, occupyMachine, OccupyMachineVariables } from '@dataconnect/generated';

// The `OccupyMachine` mutation requires an argument of type `OccupyMachineVariables`:
const occupyMachineVars: OccupyMachineVariables = {
  machineId: ..., 
  endsAt: ..., 
};

// Call the `occupyMachine()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await occupyMachine(occupyMachineVars);
// Variables can be defined inline as well.
const { data } = await occupyMachine({ machineId: ..., endsAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await occupyMachine(dataConnect, occupyMachineVars);

console.log(data.machine_update);
console.log(data.laundryActivity_insert);

// Or, you can use the `Promise` API.
occupyMachine(occupyMachineVars).then((response) => {
  const data = response.data;
  console.log(data.machine_update);
  console.log(data.laundryActivity_insert);
});
```

### Using `OccupyMachine`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, occupyMachineRef, OccupyMachineVariables } from '@dataconnect/generated';

// The `OccupyMachine` mutation requires an argument of type `OccupyMachineVariables`:
const occupyMachineVars: OccupyMachineVariables = {
  machineId: ..., 
  endsAt: ..., 
};

// Call the `occupyMachineRef()` function to get a reference to the mutation.
const ref = occupyMachineRef(occupyMachineVars);
// Variables can be defined inline as well.
const ref = occupyMachineRef({ machineId: ..., endsAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = occupyMachineRef(dataConnect, occupyMachineVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.machine_update);
console.log(data.laundryActivity_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.machine_update);
  console.log(data.laundryActivity_insert);
});
```

## ForceCancelMyMachineSession
You can execute the `ForceCancelMyMachineSession` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
forceCancelMyMachineSession(vars: ForceCancelMyMachineSessionVariables): MutationPromise<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;

interface ForceCancelMyMachineSessionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ForceCancelMyMachineSessionVariables): MutationRef<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;
}
export const forceCancelMyMachineSessionRef: ForceCancelMyMachineSessionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
forceCancelMyMachineSession(dc: DataConnect, vars: ForceCancelMyMachineSessionVariables): MutationPromise<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;

interface ForceCancelMyMachineSessionRef {
  ...
  (dc: DataConnect, vars: ForceCancelMyMachineSessionVariables): MutationRef<ForceCancelMyMachineSessionData, ForceCancelMyMachineSessionVariables>;
}
export const forceCancelMyMachineSessionRef: ForceCancelMyMachineSessionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the forceCancelMyMachineSessionRef:
```typescript
const name = forceCancelMyMachineSessionRef.operationName;
console.log(name);
```

### Variables
The `ForceCancelMyMachineSession` mutation requires an argument of type `ForceCancelMyMachineSessionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ForceCancelMyMachineSessionVariables {
  machineId: UUIDString;
}
```
### Return Type
Recall that executing the `ForceCancelMyMachineSession` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ForceCancelMyMachineSessionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ForceCancelMyMachineSessionData {
  laundryActivity_update?: LaundryActivity_Key | null;
  machine_update?: Machine_Key | null;
}
```
### Using `ForceCancelMyMachineSession`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, forceCancelMyMachineSession, ForceCancelMyMachineSessionVariables } from '@dataconnect/generated';

// The `ForceCancelMyMachineSession` mutation requires an argument of type `ForceCancelMyMachineSessionVariables`:
const forceCancelMyMachineSessionVars: ForceCancelMyMachineSessionVariables = {
  machineId: ..., 
};

// Call the `forceCancelMyMachineSession()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await forceCancelMyMachineSession(forceCancelMyMachineSessionVars);
// Variables can be defined inline as well.
const { data } = await forceCancelMyMachineSession({ machineId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await forceCancelMyMachineSession(dataConnect, forceCancelMyMachineSessionVars);

console.log(data.laundryActivity_update);
console.log(data.machine_update);

// Or, you can use the `Promise` API.
forceCancelMyMachineSession(forceCancelMyMachineSessionVars).then((response) => {
  const data = response.data;
  console.log(data.laundryActivity_update);
  console.log(data.machine_update);
});
```

### Using `ForceCancelMyMachineSession`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, forceCancelMyMachineSessionRef, ForceCancelMyMachineSessionVariables } from '@dataconnect/generated';

// The `ForceCancelMyMachineSession` mutation requires an argument of type `ForceCancelMyMachineSessionVariables`:
const forceCancelMyMachineSessionVars: ForceCancelMyMachineSessionVariables = {
  machineId: ..., 
};

// Call the `forceCancelMyMachineSessionRef()` function to get a reference to the mutation.
const ref = forceCancelMyMachineSessionRef(forceCancelMyMachineSessionVars);
// Variables can be defined inline as well.
const ref = forceCancelMyMachineSessionRef({ machineId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = forceCancelMyMachineSessionRef(dataConnect, forceCancelMyMachineSessionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.laundryActivity_update);
console.log(data.machine_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.laundryActivity_update);
  console.log(data.machine_update);
});
```

