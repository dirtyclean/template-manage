module.exports = {
  root: true,
  env: {
    node: true
  },
  /*
    配置让eslint忽略与perttier冲突的检查：extends：['plugin:prettier/recommended']。
    然而我不想这样子做，我想保留eslint的一些校验规则，可以先使用快捷键prettier格式化，再保存时自动使用eslint修复。让prettier兼容eslint；
    但是，如果你放弃使用plugin:prettier/recommended，且想要在提交git时配置先使用prettier格式化再用eslint修复，不建议这样做。因为可能会导致提交修复代码无限循环。
  */
  extends: ['plugin:vue/essential', '@vue/standard', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
// prettier 只是会帮我们格式化代码，并不能够修复所有 eslint 错误，比如定义未使用的变量，prettier 不会自动帮我们删除，要手动删除。
// 因此，prettier 后再 eslint，是有必要的。
