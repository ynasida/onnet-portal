import { getDvaApp } from 'umi';
import request from '../utils/request_kazoo';
import { dateToGregorian } from '../utils/subroutine';

export const JSON_HEADERS = () => {
  const redux_state = getDvaApp()._store.getState();
  return {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    'X-Auth-Token': redux_state.kz_login.auth_token,
  };
};

export const PDF_HEADERS = () => {
  const redux_state = getDvaApp()._store.getState();
  return {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/pdf',
    'X-Auth-Token': redux_state.kz_login.auth_token,
  };
};

export const CSV_HEADERS = () => {
  const redux_state = getDvaApp()._store.getState();
  return {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'text/csv',
    'X-Auth-Token': redux_state.kz_login.auth_token,
  };
};

export const MAYBE_SUPER_DUPER = () => {
  const redux_state = getDvaApp()._store.getState();
  if (redux_state.kz_account.data) {
    if (redux_state.kz_account.data.superduper_admin) {
      return redux_state.kz_account.data.superduper_admin === true;
    }
    return false;
  }
  return false;
};

export function timeRange(params) {
  const lookup_field = params.lookup_field ? params.lookup_field : 'created';
  const TO_TIMESTAMP = params.created_to ? params.created_to : dateToGregorian(new Date());
  const FROM_TIMESTAMP = params.created_from ? params.created_from : TO_TIMESTAMP - 7776000;
  return `?${lookup_field}_from=${FROM_TIMESTAMP}&${lookup_field}_to=${TO_TIMESTAMP}`;
}

export function kzRequest(url, params: FormDataTyp): Promise<any> {
  let dataBag;
  switch (params.method) {
    case 'GET':
    case 'DELETE':
      dataBag = {
        method: params.method,
        headers: JSON_HEADERS(),
      };
      break;

    default:
      dataBag = {
        method: params.method,
        headers: JSON_HEADERS(),
        data: { data: params.data },
      };
  }
  console.log('url: ', url);
  console.log('dataBag: ', dataBag);
  return request(url, dataBag);
}

export async function kz_user_auth(params) {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const result = request(`${API_URL_V2}/user_auth`, {
    method: 'PUT',
    data: params,
  });
  return result;
}

export async function getUser(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users/${params.owner_id}`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function getUsers(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users/`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

function userUrl(params) {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users/${params.owner_id}`;
  return url;
}

function usersUrl(params) {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/users`;
  return url;
}

export function kzUsers(params: FormDataTyp) {
  return kzRequest(usersUrl(params), params);
}

export function kzUser(params: FormDataTyp) {
  console.log('IAMMM!!!!  kzUser services file, params: ', params);
  return kzRequest(userUrl(params), params);
}

export function accountsUrl(params) {
  let url;
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  if (MAYBE_SUPER_DUPER() && params.method === 'PUT') {
    url = `${API_URL_V2}/accounts`;
  } else {
    url = `${API_URL_V2}/accounts/${params.account_id}`;
  }
  return url;
}

export function kzAccount(params: FormDataTyp) {
  return kzRequest(accountsUrl(params), params);
}

export async function aKzAccount(params: FormDataTyp): Promise<any> {
  return kzAccount(params);
}

export function getAccount(params: FormDataTyp): Promise<any> {
  return request(accountsUrl(params), {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function aGetAccount(params: FormDataTyp): Promise<any> {
  return getAccount(params);
}

export function resellerStatus(params) {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/reseller`;
  return kzRequest(url, params);
}

export async function getResellerChildren(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/children`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function getResellerSIPRegistrations(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = redux_state.kz_account.data.superduper_admin
    ? `${API_URL_V2}/registrations`
    : `${API_URL_V2}/accounts/${params.account_id}/registrations`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function SIPRegistrationsCount(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = redux_state.kz_account.data.superduper_admin
    ? `${API_URL_V2}/registrations/count`
    : `${API_URL_V2}/accounts/${params.account_id}/registrations/count`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export function getResellerChannels(params: FormDataTyp): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = redux_state.kz_account.data.superduper_admin
    ? `${API_URL_V2}/channels`
    : `${API_URL_V2}/accounts/${params.account_id}/channels`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function checkCurrentAuthToken(): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/auth/tokeninfo?token=${redux_state.kz_login.auth_token}`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export async function kzSystemStatus(): Promise<any> {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/system_status`;
  return request(url, {
    method: 'GET',
    headers: JSON_HEADERS(),
  });
}

export function AccountNumbers(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/phone_numbers`, params);
}

export function numbersClassifiers(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/phone_numbers/classifiers`, params);
}

function deviceUrl(params) {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/devices/${params.device_id}`;
  return url;
}

function devicesUrl(params) {
  const redux_state = getDvaApp()._store.getState();
  const API_URL_V2 = redux_state.settings.crossbarUrlV2;
  const url = `${API_URL_V2}/accounts/${params.account_id}/devices`;
  return url;
}

export function kzDevices(params: FormDataTyp) {
  return kzRequest(devicesUrl(params), params);
}

export function kzDevice(params: FormDataTyp) {
  console.log('IAMMM!!!!  kzDevice services file, params: ', params);
  return kzRequest(deviceUrl(params), params);
}

export function AccountDialplans(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/dialplans`, params);
}

export function AccountMedia(params: FormDataTyp): Promise<any> {
  return kzRequest(`${accountsUrl(params)}/media`, params);
}
