export const DEFAULT_HEADER = {
  'Content-Type': 'application/json',
  Accept: 'applicattion/json',
};

export function buildResponse(response: Response) {
  return response.json();
}

export function buildPath(path: string): string {
  return `${process.env.API_HOST}${path}`;
}

export function buildImagePath(path: string): string {
  if (!path) return '';
  return `${process.env.API_HOST}/${path}`;
}

export function buildHeader(accessToken: string, useFormDataInstead: boolean) {
  if (useFormDataInstead) {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }
  return {
    ...DEFAULT_HEADER,
    Authorization: `Bearer ${accessToken}`,
  };
}
