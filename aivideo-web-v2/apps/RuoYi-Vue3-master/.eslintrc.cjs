/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: ZCR
 * @Date: 2023-01-06 14:26:09
 * @LastEditors: ZCR
 * @LastEditTime: 2023-11-20 10:15:55
 */
export default  {
    parser: 'vue-eslint-parser',

    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },

    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],

    rules: {
        // override/add rules settings here, such as:
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        "no-unused-vars": [2, { 
        // 允许声明未使用变量
        "vars": "local",
        // 参数不检查
        "args": "none"
        }],
        // 关闭语句强制分号结尾
        "semi": [0],
        //key值前面是否要有空格
        "key-spacing": [0, {
        "singleLine": {
            "beforeColon": false,
            "afterColon": true
        },
        "multiLine": {
            "beforeColon": true,
            "afterColon": true,
            "align": "colon"
        },
        //空行最多不能超过100行
        "no-multiple-empty-lines": [0, {"max": 100}],
        //关闭禁止混用tab和空格
        "no-mixed-spaces-and-tabs": [0],
        //数组第一个指定是否启用这个规则，第二个指定几个空格
        "indent":[1,2],
        }]
    }
}
