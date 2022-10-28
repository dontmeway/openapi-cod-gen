import Handlebars from 'handlebars/runtime';

import requestTemplate from '../templates/base/index.hbs';
import configTemplate from '../templates/base/config.hbs';
import importBaseRequestTemplate from '../templates/common/import-base.hbs';
import domainRequestTemplate from '../templates/request/request.hbs';
import requestParamsTemplate from '../templates/request/params.hbs';
import modelTemplate from '../templates/model/model.hbs';
import enumTemplate from '../templates/model/enum.hbs';
import dictTemplate from '../templates/model/dict.hbs';
import { registerHandleBarsHelpers } from './register-handlebars-helpers';

export const registerHandleBars = () => {
  const baseRequestFile = Handlebars.template(requestTemplate);
  const configFile = Handlebars.template(configTemplate);
  const domainRequestFile = Handlebars.template(domainRequestTemplate);
  const modelFile = Handlebars.template(modelTemplate);

  registerHandleBarsHelpers();

  Handlebars.registerPartial(
    'importBaseRequest',
    Handlebars.template(importBaseRequestTemplate),
  );
  Handlebars.registerPartial(
    'params',
    Handlebars.template(requestParamsTemplate),
  );
  Handlebars.registerPartial('enumType', Handlebars.template(enumTemplate));
  Handlebars.registerPartial('dictType', Handlebars.template(dictTemplate));

  return { baseRequestFile, configFile, domainRequestFile, modelFile };
};
