import antfu from '@antfu/eslint-config'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

export default antfu(
  {
    // Configures for antfu's config
    vue: true,
    typescript: true,
  },
  // From the second arguments they are ESLint Flat Configs
  // you can have multiple configs
  {
    plugins: {
      vue,
      tseslint,
    },
  },
)
