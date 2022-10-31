import kebabCase from 'just-kebab-case';

import type { OpenApi } from '../interfaces/OpenApi';
import type { OpenApiSchema } from '../interfaces/OpenApiSchema';
import type { Model, ModelProp } from './types';

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
      imports: [],
    };

    if (schema.type === 'object') {
      if (typeof schema.type === 'string') {
        model.type = schema.type;
        model.props = getProps(schema);
        model.props.forEach((prop) => {
          if (prop.shouldImport) {
            if (
              !model.imports.some(
                ({ typeName }) => !prop.imports.includes(typeName),
              )
            ) {
              const imports = model.imports.concat(
                prop.imports.map((type) => ({
                  from: kebabCase(type),
                  typeName: type,
                })),
              );

              model.imports = imports;
            }
          }
        });
        models[model.modelFileName] = model;
      }
    }

    if ((schema.enum ?? []).length > 0) {
      model.type = 'enum';
      model.enum = schema.enum?.map((e) => ({
        type: typeof e === 'number' ? 'number' : 'string',
        value: e,
      }));

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

    if (!prop.readOnly) {
      const type = prop.type ?? 'doesNotExist';

      let parsed: ModelProp = {
        name: propName,
        required: requiredProps.includes(propName),
        nullable: prop.nullable === true,
        type: 'unknown',
        ref: 'primitive',
        shouldImport: false,
        imports: [],
      };

      switch (type) {
        case 'integer':
        case 'boolean':
        case 'string':
          parsed = {
            ...parsed,
            type: type.replace('integer', 'number'),
            ref: 'primitive',
          };

          parsedProps.push(parsed);
          break;
        case 'array':
          if (typeof prop?.items?.type !== 'string') {
            const typeRef = prop?.items?.$ref?.split('/').at(-1) ?? 'unknown';
            parsed = {
              ...parsed,
              type: typeRef,
              ref: 'array',
              shouldImport: true,
              imports: parsed.imports.concat(typeRef),
            };
          } else {
            parsed = {
              ...parsed,
              type: prop.items.type.replace('integer', 'number'),
              ref: 'array',
            };
          }

          parsedProps.push(parsed);
          break;
        case 'doesNotExist': {
          if (typeof prop.$ref === 'string') {
            const typeRef = prop.$ref.split('/').at(-1) ?? 'unknown';
            parsed = {
              ...parsed,
              type: typeRef,
              ref: 'instance',
              shouldImport: true,
              imports: parsed.imports.concat(typeRef),
            };

            parsedProps.push(parsed);
            break;
          }

          if (Array.isArray(prop.oneOf)) {
            const type = prop.oneOf
              .map((el) => el.$ref?.split('/').at(-1))
              .filter(Boolean)
              .join(' | ');

            parsed = {
              ...parsed,
              type,
              shouldImport: true,
            };

            parsed.imports.push(
              ...((prop.oneOf
                .map((el) => el.$ref?.split('/').at(-1))
                .filter(Boolean) ?? []) as string[]),
            );
            parsedProps.push(parsed);
          }
        }
      }
    }
  });

  return parsedProps;
};

function hasProps(schema: OpenApiSchema) {
  return Object.values(schema.properties ?? {}).some((prop) => !prop.readOnly);
}
