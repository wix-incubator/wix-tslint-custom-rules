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
    "no-full-package-import": true,
    "no-untyped-public-signature": true,
    "no-wallaby-file-only": true
  }
}
```
