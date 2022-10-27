import { OpenApiParameter } from '../interfaces/OpenApiParameter';

export type Request = {
  name: string;
  method: string;
  path: string;
  params: RequestParams;
  paramsTypeName: string;
};

export type RequestParams = {
  params: Param[];
  pathParams: Param[];
  queryParams: Param[];
};

export type Param = {
  in: OpenApiParameter['in'];
  name: string;
  baseName: string;
  required: boolean;
  nullable: boolean;
  type: string;
};
