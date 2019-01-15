const { expect } = require('chai')
const { join } = require('path')
const { transform } = require('@babel/core')

const plugin = require('../index.js')

function relativify({ input }) {
  const { code } = transform(input, {
    filename: join(__dirname, 'file.js'),
    plugins: [plugin]
  })

  return { output: code }
}

describe('relativify-imports', () => {
  context('when relative imports', () => {
    context('from outer folder', () => {
      it('are unchanged', () => {
        const input = `import { MyModule } from "../src/some-folder/my-module.js";`
        const { output } = relativify({ input })
        expect(output).to.be.equal(input)
      })
    })

    context('from inner folder with . prefix', () => {
      it('are unchanged', () => {
        const input = `import { MyModule } from "./some-folder/my-module.js";`
        const { output } = relativify({ input })
        expect(output).to.be.equal(input)
      })
    })

    context('from inner folder without . prefix', () => {
      it('are unchanged', () => {
        const input = `import { MyModule } from "some-folder/my-module.js";`
        const { output } = relativify({ input })
        expect(output).to.be.equal(input)
      })
    })
  })

  context('when bare imports', () => {
    context('from top-level package', () => {
      it('are unchanged', () => {
        const input = `import { MyModule } from "my-module";`
        const { output } = relativify({ input })
        expect(output).to.be.equal(input)
      })
    })

    context('from organization package', () => {
      it('are unchanged', () => {
        const input = `import { MyModule } from "@company/my-module";`
        const { output } = relativify({ input })
        expect(output).to.be.equal(input)
      })
    })
  })

  context('absolute imports', () => {
    it('are made relative', () => {
      const input = `import { MyModule } from "/test-fixtures/my-module.js";`
      const { output } = relativify({ input })
      expect(output).to.be.equal(`import { MyModule } from "../test-fixtures/my-module.js";`)
    })
  })
})
