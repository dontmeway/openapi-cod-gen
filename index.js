const { program } = require('commander')
const JsonSchemaRefParser = require('@apidevtools/json-schema-ref-parser')

const params = program
  .requiredOption('-i, --input <value>', '--input must be path')
  .parse(process.argv)
  .opts()

const generate = async ({ input }) => {
  let openApi = input
  if (typeof openApi === 'string') {
    openApi = await JsonSchemaRefParser.bundle(input, input, {})
  }

  console.log(JSON.stringify(openApi, null, 2))
}

generate(params)
