import kebabCase from 'just-kebab-case';
import type { OpenApi } from '../interfaces/OpenApi';
import type { OpenApiSchema } from '../interfaces/OpenApiSchema';
import { Model, ModelProp } from './types';

export const getModels = (openApi: OpenApi) => {
  const schemas = openApi.components?.schemas ?? {};

  const models: Record<string, Model> = {};

  Object.keys(schemas).forEach((schemaName) => {
    const schema = schemas[schemaName];
    const model: Model = {
      schemaName,
      modelFileName: kebabCase(schemaName),
      type: '',
      props: [],
    };

    if (typeof schema.type === 'string') {
      if ((schema.enum ?? []).length > 0) {
        model.type = 'enum';
        model.enum = schema.enum?.map((e) => ({
          type: typeof e === 'number' ? 'number' : 'string',
          value: e,
        }));
      } else {
        model.type = schema.type;
        model.props = getProps(schema);
      }
      models[model.modelFileName] = model;
    }
  });

  return models;
};

const getProps = (schema: OpenApiSchema) => {
  const props = schema.properties ?? {};
  const requiredProps = schema.required ?? [];

  const parsedProps: ModelProp[] = [];

  Object.keys(props).forEach((propName) => {
    const prop = props[propName];

    if (!prop.readOnly && typeof prop.type === 'string') {
      const parsed = {
        type: prop.type.replace('integer', 'number'),
        name: propName,
        required: requiredProps.includes(propName),
        nullable: prop.nullable === true,
      };

      parsedProps.push(parsed);
    }
  });

  return parsedProps;
};
