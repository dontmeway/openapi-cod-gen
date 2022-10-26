import Handlebars from "handlebars/runtime";

import requestTemplate from "../templates/base/index.hbs";
import configTemplate from "../templates/base/config.hbs";
import importBaseRequestTemplate from "../templates/common/import-base.hbs";
import domainRequestTemplate from "../templates/request/request.hbs";

export const registerHandleBars = () => {
  const baseRequestFile = Handlebars.template(requestTemplate);
  const configFile = Handlebars.template(configTemplate);
  const domainRequestFile = Handlebars.template(domainRequestTemplate);

  Handlebars.registerPartial("importBaseRequest", Handlebars.template(importBaseRequestTemplate));

  return { baseRequestFile, configFile, domainRequestFile };
};
