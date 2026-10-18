const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const DormBuilding = {
  BUILDING_F: "BUILDING_F",
  BUILDING_E: "BUILDING_E",
  BUILDING_G: "BUILDING_G",
}
exports.DormBuilding = DormBuilding;

const MachineType = {
  WASHER: "WASHER",
  DRYER: "DRYER",
}
exports.MachineType = MachineType;

const connectorConfig = {
  connector: 'example',
  service: 'lms-kiu-service',
  location: 'europe-central2'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const listMachinesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMachines');
}
listMachinesRef.operationName = 'ListMachines';
exports.listMachinesRef = listMachinesRef;

exports.listMachines = function listMachines(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMachinesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listMachinesByBuildingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMachinesByBuilding', inputVars);
}
listMachinesByBuildingRef.operationName = 'ListMachinesByBuilding';
exports.listMachinesByBuildingRef = listMachinesByBuildingRef;

exports.listMachinesByBuilding = function listMachinesByBuilding(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listMachinesByBuildingRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMachineActiveSessionOwnerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMachineActiveSessionOwner', inputVars);
}
getMachineActiveSessionOwnerRef.operationName = 'GetMachineActiveSessionOwner';
exports.getMachineActiveSessionOwnerRef = getMachineActiveSessionOwnerRef;

exports.getMachineActiveSessionOwner = function getMachineActiveSessionOwner(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMachineActiveSessionOwnerRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyActiveMachineSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyActiveMachineSession', inputVars);
}
getMyActiveMachineSessionRef.operationName = 'GetMyActiveMachineSession';
exports.getMyActiveMachineSessionRef = getMyActiveMachineSessionRef;

exports.getMyActiveMachineSession = function getMyActiveMachineSession(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getMyActiveMachineSessionRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getMyUserAccountRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyUserAccount');
}
getMyUserAccountRef.operationName = 'GetMyUserAccount';
exports.getMyUserAccountRef = getMyUserAccountRef;

exports.getMyUserAccount = function getMyUserAccount(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyUserAccountRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createMyUserAccountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMyUserAccount', inputVars);
}
createMyUserAccountRef.operationName = 'CreateMyUserAccount';
exports.createMyUserAccountRef = createMyUserAccountRef;

exports.createMyUserAccount = function createMyUserAccount(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createMyUserAccountRef(dcInstance, inputVars));
}
;

const updateMyBuildingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMyBuilding', inputVars);
}
updateMyBuildingRef.operationName = 'UpdateMyBuilding';
exports.updateMyBuildingRef = updateMyBuildingRef;

exports.updateMyBuilding = function updateMyBuilding(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateMyBuildingRef(dcInstance, inputVars));
}
;

const occupyMachineRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'OccupyMachine', inputVars);
}
occupyMachineRef.operationName = 'OccupyMachine';
exports.occupyMachineRef = occupyMachineRef;

exports.occupyMachine = function occupyMachine(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(occupyMachineRef(dcInstance, inputVars));
}
;

const forceCancelMyMachineSessionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ForceCancelMyMachineSession', inputVars);
}
forceCancelMyMachineSessionRef.operationName = 'ForceCancelMyMachineSession';
exports.forceCancelMyMachineSessionRef = forceCancelMyMachineSessionRef;

exports.forceCancelMyMachineSession = function forceCancelMyMachineSession(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(forceCancelMyMachineSessionRef(dcInstance, inputVars));
}
;
