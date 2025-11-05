import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },

})
