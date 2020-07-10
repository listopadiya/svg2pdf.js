import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import license from 'rollup-plugin-license'
import pkg from './package.json'

function licenseBanner() {
  return license({
    banner: {
      content: { file: './LICENSE' }
    }
  })
}

const umdExternals = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {})
]
const externals = [...Object.keys(pkg.dependencies || {}), ...umdExternals]

const globals = {
  cssesc: 'cssesc',
  jspdf: 'jspdf',
  svgpath: 'svgpath'
}

const umd = {
  input: 'src/svg2pdf.ts',
  output: [
    {
      file: pkg.browser.replace('.min', ''),
      format: 'umd',
      name: 'svg2pdf',
      exports: 'named',
      globals
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'svg2pdf',
      exports: 'named',
      globals,
      plugins: [terser({})]
    }
  ],
  external: umdExternals,
  plugins: [typescript(), commonjs({ extensions: ['.js', '.ts'] }), resolve(), licenseBanner()]
}

const es = {
  input: 'src/svg2pdf.ts',
  output: [
    {
      file: pkg.module.replace('.min', ''),
      format: 'es',
      name: 'svg2pdf',
      plugins: []
    },
    {
      file: pkg.module,
      format: 'es',
      name: 'svg2pdf',
      plugins: [terser({})]
    }
  ],
  external: externals,
  plugins: [typescript(), commonjs({ extensions: ['.js', '.ts'] }), resolve(), licenseBanner()]
}
const node = {
  input: 'src/svg2pdf.ts',
  output: [
    {
      file: pkg.main.replace('.min', ''),
      format: 'cjs',
      name: 'svg2pdf',
      exports: 'named',
      plugins: []
    },
    {
      file: pkg.main,
      format: 'cjs',
      name: 'svg2pdf',
      exports: 'named',
      plugins: [terser({})]
    }
  ],
  external: externals,
  plugins: [typescript(), commonjs({ extensions: ['.js', '.ts'] }), resolve(), licenseBanner()]
}

export default [umd, es, node]
