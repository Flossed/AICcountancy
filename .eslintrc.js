module.exports = {
   "env": {
      "browser": true,
      "commonjs": true,
      "es2021": true
   },
   "extends": "eslint:recommended",
   "overrides": [
   ],
   "parserOptions": {
      "ecmaVersion": "latest"
   },
   "rules": {    "spaced-comment": ["off", "always"],
      "no-multi-spaces": ["off", "always"],   
      "semi": [2, "always"],  
      "indent": ["warn", 3],
      "brace-style": ["warn", "allman", { "allowSingleLine": true } ],
      "keyword-spacing": ["warn", { "before": true }],
      "space-before-function-paren": ["warn", {
         "anonymous": "always",
         "named": "always",
         "asyncArrow": "ignore"
      }], 
      "padded-blocks" : ["warn", "never", { "allowSingleLineBlocks": true } ],
      "space-in-parens" : ["warn", "always"],
      "quotes": ["warn", "double"]
              
   }
};
