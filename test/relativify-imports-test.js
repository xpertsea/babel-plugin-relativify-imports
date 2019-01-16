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
  context('already relative', () => {
    context('static imports', () => {
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

    context('dynamic imports', () => {
      context('from outer folder', () => {
        it('are unchanged', () => {
          const input = `import("../src/some-folder/my-module.js");`
          const { output } = relativify({ input })
          expect(output).to.be.equal(input)
        })
      })

      context('from inner folder with . prefix', () => {
        it('are unchanged', () => {
          const input = `import("./some-folder/my-module.js");`
          const { output } = relativify({ input })
          expect(output).to.be.equal(input)
        })
      })

      context('from inner folder without . prefix', () => {
        it('are unchanged', () => {
          const input = `import("some-folder/my-module.js");`
          const { output } = relativify({ input })
          expect(output).to.be.equal(input)
        })
      })
    })

    context('exports', () => {
      context('from outer folder', () => {
        it('are unchanged', () => {
          const input = `export { MyModule } from "../src/some-folder/my-module.js";`
          const { output } = relativify({ input })
          expect(output).to.be.equal(input)
        })
      })

      context('from inner folder with . prefix', () => {
        it('are unchanged', () => {
          const input = `export { MyModule } from "./some-folder/my-module.js";`
          const { output } = relativify({ input })
          expect(output).to.be.equal(input)
        })
      })

      context('from inner folder without . prefix', () => {
        it('are unchanged', () => {
          const input = `export { MyModule } from "some-folder/my-module.js";`
          const { output } = relativify({ input })
          expect(output).to.be.equal(input)
        })
      })
    })
  })

  context('bare imports', () => {
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


  context('absolute', () => {
    context('static imports', () => {
      it('are made relative', () => {
        const input = `import { MyModule } from "/src/some-folder/my-module.js";`
        const { output } = relativify({ input })
        expect(output).to.be.equal(`import { MyModule } from "../src/some-folder/my-module.js";`)
      })
    })

    context('dynamic imports', () => {
      it('are made relative', () => {
        const input = `import("/src/some-folder/my-module.js");`
        const { output } = relativify({ input })
        expect(output).to.be.equal(`import("../src/some-folder/my-module.js");`)
      })
    })

    context('exports', () => {
      it('are made relative', () => {
        const input = `export * from "/src/some-folder/my-module.js";`
        const { output } = relativify({ input })
        expect(output).to.be.equal(`export * from "../src/some-folder/my-module.js";`)
      })
    })
  })
})
