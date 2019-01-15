const path = require('path')
const syntax = require('@babel/plugin-syntax-dynamic-import')

function isExpressionDynamicImport({ expression }) {
  return expression.node.callee.type === 'Import'
}

function relativifyModulePath({ types, modulePathSource, sourceFileName }) {
  try {
    if (modulePathSource.node === null) return
    const modulePath = modulePathSource.node.value

    if (!path.isAbsolute(modulePath)) return
    const absoluteModulePath = modulePath

    const relativeModulePath = path.relative(sourceFileName, absoluteModulePath)
    const relativeModulePathSource = types.stringLiteral(relativeModulePath)
    modulePathSource.replaceWith(relativeModulePathSource)
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = ({ types }) => ({
  inherits: syntax.default,
  visitor: {
    CallExpression(expression) {
      if (!isExpressionDynamicImport({ expression })) return
      const [modulePathSource] = expression.get('arguments')
      if (modulePathSource.type !== 'StringLiteral') return

      relativifyModulePath({
        types,
        modulePathSource,
        sourceFileName: expression.hub.file.opts.parserOpts.sourceFileName
      })
    },
    'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(expression) {
      relativifyModulePath({
        types,
        modulePathSource: expression.get('source'),
        sourceFileName: expression.hub.file.opts.parserOpts.sourceFileName
      })
    }
  }
})
