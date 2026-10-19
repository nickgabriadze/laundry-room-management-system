# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListMachines, useListMachinesByBuilding, useGetMachineActiveSessionOwner, useGetMachinePreviousSessionOwner, useGetMyActiveMachineSession, useGetMyUserAccount, useCreateMyUserAccount, useUpdateMyBuilding, useOccupyMachine, useForceCancelMyMachineSession } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListMachines();

const { data, isPending, isSuccess, isError, error } = useListMachinesByBuilding(listMachinesByBuildingVars);

const { data, isPending, isSuccess, isError, error } = useGetMachineActiveSessionOwner(getMachineActiveSessionOwnerVars);

const { data, isPending, isSuccess, isError, error } = useGetMachinePreviousSessionOwner(getMachinePreviousSessionOwnerVars);

const { data, isPending, isSuccess, isError, error } = useGetMyActiveMachineSession(getMyActiveMachineSessionVars);

const { data, isPending, isSuccess, isError, error } = useGetMyUserAccount();

const { data, isPending, isSuccess, isError, error } = useCreateMyUserAccount(createMyUserAccountVars);

const { data, isPending, isSuccess, isError, error } = useUpdateMyBuilding(updateMyBuildingVars);

const { data, isPending, isSuccess, isError, error } = useOccupyMachine(occupyMachineVars);

const { data, isPending, isSuccess, isError, error } = useForceCancelMyMachineSession(forceCancelMyMachineSessionVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listMachines, listMachinesByBuilding, getMachineActiveSessionOwner, getMachinePreviousSessionOwner, getMyActiveMachineSession, getMyUserAccount, createMyUserAccount, updateMyBuilding, occupyMachine, forceCancelMyMachineSession } from '@dataconnect/generated';


// Operation ListMachines: 
const { data } = await ListMachines(dataConnect);

// Operation ListMachinesByBuilding:  For variables, look at type ListMachinesByBuildingVars in ../index.d.ts
const { data } = await ListMachinesByBuilding(dataConnect, listMachinesByBuildingVars);

// Operation GetMachineActiveSessionOwner:  For variables, look at type GetMachineActiveSessionOwnerVars in ../index.d.ts
const { data } = await GetMachineActiveSessionOwner(dataConnect, getMachineActiveSessionOwnerVars);

// Operation GetMachinePreviousSessionOwner:  For variables, look at type GetMachinePreviousSessionOwnerVars in ../index.d.ts
const { data } = await GetMachinePreviousSessionOwner(dataConnect, getMachinePreviousSessionOwnerVars);

// Operation GetMyActiveMachineSession:  For variables, look at type GetMyActiveMachineSessionVars in ../index.d.ts
const { data } = await GetMyActiveMachineSession(dataConnect, getMyActiveMachineSessionVars);

// Operation GetMyUserAccount: 
const { data } = await GetMyUserAccount(dataConnect);

// Operation CreateMyUserAccount:  For variables, look at type CreateMyUserAccountVars in ../index.d.ts
const { data } = await CreateMyUserAccount(dataConnect, createMyUserAccountVars);

// Operation UpdateMyBuilding:  For variables, look at type UpdateMyBuildingVars in ../index.d.ts
const { data } = await UpdateMyBuilding(dataConnect, updateMyBuildingVars);

// Operation OccupyMachine:  For variables, look at type OccupyMachineVars in ../index.d.ts
const { data } = await OccupyMachine(dataConnect, occupyMachineVars);

// Operation ForceCancelMyMachineSession:  For variables, look at type ForceCancelMyMachineSessionVars in ../index.d.ts
const { data } = await ForceCancelMyMachineSession(dataConnect, forceCancelMyMachineSessionVars);


```