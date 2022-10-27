import Handlebars from "handlebars/runtime";

export const registerHandleBarsHelpers = () => {
  Handlebars.registerHelper(
    "equals",
    function (this: any, a: any, b: any, options: Handlebars.HelperOptions): string {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  );

  Handlebars.registerHelper(
    "notEquals",
    function (this: any, a: any, b: any, options: Handlebars.HelperOptions): string {
      return a !== b ? options.fn(this) : options.inverse(this);
    }
  );
};
