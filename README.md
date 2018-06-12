# wix-tslint-custom-rules
Custom rules for TSLint

## Installation
To install the package:

`npm i -d wix-tslint-custom-rules`

Then in your tslint.json file add the following line:
```json
"extends": [
    "wix-tslint-custom-rules"
]
```

Now you can add any rule you want from the package like so:
```json
{
  "rules":
  {
    "no-async-without-await": true,
    "no-untyped-public-signature": true,
    "no-wallaby-file-only": true,
    "no-full-package-import": true
  }
}
```

Rule | Description
--- | ---
`no-async-without-await` | Does not allow an async function without using the `await` keyword. In addition to making the code cleaner, it will also result in smaller transpiled code
`no-untyped-public-signature` | Does not allow any untyped paramers nor return type on a public method. By default, `any` is forbidden as well, but can be allowed using: `"no-untyped-public-signature": [true, "allow-any"]`
`no-wallaby-file-only` | Makes sure no `//file.only` comment (Wallby.js annotation) is left by mistake.
`no-full-package-import` | Does not allow to import an entire package, only the required functionality. For example, use `import * as compact from 'lodash/compact'` instead of `import * as _ from 'lodash'` and `_.compact`. This rule is generic, and gets options like so: `"no-full-package-import": [true, "lodash"]`.
