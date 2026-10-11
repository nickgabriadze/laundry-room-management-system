# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListMachines, useListMachinesByBuilding, useGetMyUserAccount, useCreateMyUserAccount, useUpdateMyBuilding } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListMachines();

const { data, isPending, isSuccess, isError, error } = useListMachinesByBuilding(listMachinesByBuildingVars);

const { data, isPending, isSuccess, isError, error } = useGetMyUserAccount();

const { data, isPending, isSuccess, isError, error } = useCreateMyUserAccount(createMyUserAccountVars);

const { data, isPending, isSuccess, isError, error } = useUpdateMyBuilding(updateMyBuildingVars);

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
import { listMachines, listMachinesByBuilding, getMyUserAccount, createMyUserAccount, updateMyBuilding } from '@dataconnect/generated';


// Operation ListMachines: 
const { data } = await ListMachines(dataConnect);

// Operation ListMachinesByBuilding:  For variables, look at type ListMachinesByBuildingVars in ../index.d.ts
const { data } = await ListMachinesByBuilding(dataConnect, listMachinesByBuildingVars);

// Operation GetMyUserAccount: 
const { data } = await GetMyUserAccount(dataConnect);

// Operation CreateMyUserAccount:  For variables, look at type CreateMyUserAccountVars in ../index.d.ts
const { data } = await CreateMyUserAccount(dataConnect, createMyUserAccountVars);

// Operation UpdateMyBuilding:  For variables, look at type UpdateMyBuildingVars in ../index.d.ts
const { data } = await UpdateMyBuilding(dataConnect, updateMyBuildingVars);


```