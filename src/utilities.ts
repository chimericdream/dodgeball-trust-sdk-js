import {ApiVersion, IDodgeballVerifyResponse, IFingerprint, IInitConfig, IVerification, IntegrationName, VerificationOutcome, VerificationStatus} from './types';
import axios, { Method } from "axios";

interface IRequestParams {
  url: string;
  method: Method;
  headers: any;
  data: any;
}

interface IGetInitializationConfigParams {
  url: string;
  version: string;
  token: string;
}

interface IIdentifyDeviceParams {
  url: string;
  version: string;
  token: string;
  sourceId?: string;
  fingerprints: IFingerprint[];
}

// function to wrap axios requests
export const makeRequest = async ({ url, method, headers, data }: IRequestParams) => {
  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// function to construct an apiUrl with version appended to the end
export const constructApiUrl = (url: string, version: string) => {
  // ensure that the url ends with a '/'
  if (url.charAt(url.length - 1) !== "/") {
    url += "/";
  }

  return `${url}${version}/`;
}

// function to construct api request headers
export const constructApiHeaders = (token: string, sourceId?: string) => {
  let headers: {[key: string]: string} = {
    'Dodgeball-Public-Key': `${token}`,
  };

  if (sourceId) {
    headers['Dodgeball-Source-Id'] = sourceId;
  }

  return headers;
}

// function to get integrations to run
export const getInitializationConfig = async ({
  url,
  token,
  version,
}: IGetInitializationConfigParams): Promise<IInitConfig> => {
  const headers = constructApiHeaders(token);
  const apiUrl = constructApiUrl(url, version);

  const response = await makeRequest({
    url: `${apiUrl}init`,
    method: "GET",
    headers,
    data: null,
  });

  return response;
};

// function to identify the current device
export const sendIdentifyDevice = async ({url, token, version, sourceId, fingerprints}: IIdentifyDeviceParams) => {
  const headers = constructApiHeaders(token, sourceId);
  const apiUrl = constructApiUrl(url, version);

  const response = await makeRequest({
    url: `${apiUrl}identify`,
    method: 'POST',
    headers,
    data: {
      fingerprints
    }
  });

  return response.id;
}

// function to poll api for updates to a verification
export const queryVerification = async (url: string, token: string, version: string, verification: IVerification): Promise<IVerification> => {
  const headers = constructApiHeaders(token);
  const apiUrl = constructApiUrl(url, version);

  const response = await makeRequest({
    url: `${apiUrl}verification/${verification.id}`,
    method: "GET",
    headers,
    data: null,
  });

  return response;
}

// Load an external script
export const loadScript = async (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        resolve();
      };
      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
}