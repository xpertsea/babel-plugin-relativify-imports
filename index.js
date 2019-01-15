const path = require('path')
const syntax = require('@babel/plugin-syntax-dynamic-import')

function isExpressionDynamicImport({ expression }) {
  return expression.node.callee.type === 'Import'
}

function convertToRelativePath({ absoluteModulePath, sourceFileFullPath }) {
  const sourceFileFolderFullPath = path.dirname(sourceFileFullPath)
  const moduleFileFullPath = path.join(__dirname, absoluteModulePath)
  return path.relative(sourceFileFolderFullPath, moduleFileFullPath)
}

function relativifyModulePath({ types, modulePathSource, sourceFileFullPath }) {
  try {
    if (modulePathSource.node === null) return
    const modulePath = modulePathSource.node.value

    if (!path.isAbsolute(modulePath)) return
    const relativeModulePath = convertToRelativePath({ absoluteModulePath: modulePath, sourceFileFullPath })

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
        sourceFileFullPath: expression.hub.file.opts.parserOpts.sourceFileName
      })
    },
    'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(expression) {
      relativifyModulePath({
        types,
        modulePathSource: expression.get('source'),
        sourceFileFullPath: expression.hub.file.opts.parserOpts.sourceFileName
      })
    }
  }
})
