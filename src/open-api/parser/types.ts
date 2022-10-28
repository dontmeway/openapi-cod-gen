import { OpenApiParameter } from '../interfaces/OpenApiParameter';

export type Request = {
  name: string;
  method: string;
  path: string;
  params: RequestParams;
  paramsTypeName: string;
  requestBody: string | null;
};

export type RequestParams = {
  params: Param[];
  pathParams: Param[];
  queryParams: Param[];
};

export type Param = {
  in: OpenApiParameter['in'] | 'body';
  name: string;
  baseName: string;
  required: boolean;
  nullable: boolean;
  type: string;
};

export type ModelProp = {
  name: string;
  type: string;
  required: boolean;
  nullable: boolean;
};

export type Model = {
  schemaName: string;
  modelFileName: string;
  type: string;
  props: ModelProp[];
  enum?: { value: string | number; type: 'string' | 'number' }[];
};

export type RequestImport = {
  name: string;
  from: string;
};
