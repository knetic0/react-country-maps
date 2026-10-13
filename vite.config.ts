import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const root = import.meta.dirname

// One entry per country folder, so consumers only bundle what they import
const countryEntries = Object.fromEntries(
  readdirSync(resolve(root, 'src/countries'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [
      `countries/${entry.name}/index`,
      resolve(root, 'src/countries', entry.name, 'index.ts'),
    ]),
)

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    command === 'build' &&
      dts({
        tsconfigPath: resolve(root, 'tsconfig.app.json'),
        include: ['src'],
        // Consumers with "moduleResolution": "node16"/"nodenext" need full
        // relative paths in .d.ts files ("./core/CountryMap.js", "../../index.js").
        beforeWriteFile: (filePath, content) => ({
          filePath,
          content: content.replace(
            /((?:from|import)\s*\(?\s*)(['"])(\.{1,2}(?:\/[^'"]*)?)\2/g,
            (_match, prefix: string, quote: string, specifier: string) => {
              if (specifier.endsWith('.js')) return `${prefix}${quote}${specifier}${quote}`
              const isDirectory = /(^|\/)\.{1,2}$/.test(specifier)
              const fixed = isDirectory ? `${specifier}/index.js` : `${specifier}.js`
              return `${prefix}${quote}${fixed}${quote}`
            },
          ),
        }),
      }),
  ],
  // Never copy static files into the package, even if a public/ folder is added later
  publicDir: false,
  build: {
    lib: {
      entry: {
        index: resolve(root, 'src/index.ts'),
        ...countryEntries,
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/],
      output: {
        // The core components use hooks, so Next.js App Router must treat them
        // as client components. Country data stays server-safe.
        banner: (chunk) =>
          chunk.isEntry && chunk.name === 'index' ? '"use client";' : '',
      },
    },
  },
}))
