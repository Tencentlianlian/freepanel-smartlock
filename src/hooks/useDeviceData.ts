import { useReducer } from 'react';
import { DataTemplateProperty, normalizeDataByTemplate } from './dataTemplate';

interface DeviceDataState {
  deviceData: Record<string, unknown>;
  deviceStatus: number;
  propertyMap: Record<string, DataTemplateProperty>;
  eventMap: Record<string, any>;
  propertyList: DataTemplateProperty[];
  eventList: any[];
}

function reducer(state: DeviceDataState, action: {
  type: string;
  payload: any;
}) {
  const { type, payload } = action;

  switch (type) {
    case 'data': {
      const deviceData = state.deviceData;

      Object.keys(payload || {}).forEach((key) => {
        deviceData[key] = payload[key].Value;
      });

      return {
        ...state,
        deviceData,
      };
    }
    case 'status':
      return {
        ...state,
        deviceStatus: payload,
      };
  }

  return state;
}

function initState(sdk: any) {
  const propertyMap = <Record<string, DataTemplateProperty>>{};
  const propertyList = <DataTemplateProperty[]>sdk.dataTemplate.properties;
  const eventMap = <Record<string, any>>{};
  const eventList = <DataTemplateProperty[]>sdk.dataTemplate.events;

  propertyList.forEach((item: DataTemplateProperty) => {
    propertyMap[item.id] = item;
  });
  eventList.forEach((item: any) => {
    eventMap[item.id] = item;
  });

  return {
    propertyMap: propertyMap,
    propertyList: propertyList,
    eventMap,
    eventList: eventList,
    deviceData: normalizeDataByTemplate(<Record<string, unknown>>sdk.deviceData, propertyList),
    deviceStatus: <number>sdk.deviceStatus,
  };
}

export function useDeviceInfo(sdk: any = window.h5PanelSdk) {
  const [state, dispatch] = useReducer(reducer, sdk, initState);

  const onDeviceDataChange = (deviceData: Record<string, { Value: unknown; LastUpdate: number }>) => {
    dispatch({
      type: 'data',
      payload: deviceData,
    });
  };

  const onDeviceStatusChange = (deviceStatus: number) => {
    dispatch({
      type: 'status',
      payload: deviceStatus,
    });
  };

  return [
    state,
    {
      onDeviceDataChange,
      onDeviceStatusChange
    },
  ] as const;
}
