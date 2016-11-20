[![build status](https://img.shields.io/travis/paypal/mock-meddleware/master.svg?style=flat-square)](https://travis-ci.org/paypal/mock-meddleware)
[![npm version](https://img.shields.io/npm/v/mock-meddleware.svg?style=flat-square)](https://www.npmjs.com/package/mock-meddleware)
[![npm downloads](https://img.shields.io/npm/dm/mock-meddleware.svg?style=flat-square)](https://www.npmjs.com/package/mock-meddleware)
[![npm downloads](https://img.shields.io/coveralls/paypal/mock-meddleware/master.svg?style=flat-square)](https://coveralls.io/github/paypal/mock-meddleware)

# mock-meddleware

It is a mocking middleware which can be used in either Express or KrakenJS.

It allows you to override CommonJS modules behaviour.

## Background
Development involving multiple teams, sometimes, certain service calls might not ready for integration and you need to mock those responses. This middleware allows you to test your code to handle those responses and new code/business logics following that. It can parallelise the frontend and backend development based on predefined contracts (i.e. JSON).

## Examples

### Express

```js
var options = {
    "mocks": {
        "folder": mocksPath,
        "structure": ["scenarios"]
    },
    "wrappers": {
        "enabled": true,
        "mappings": [{
            "prefix": "serviceA",
            "wrapper": wrapperPath,
            "replace": replacePath
        }]
    }
}

app.use(require('mock-meddleware')(options));
```

**Note:**  mocksPath, replacePath & wrapperPath are `full path`

### KrakenJS

development.json

```json
{
   "middleware":{
      "mocking":{
         "enabled":true,
         "priority":10,
         "module":{
            "name":"mock-meddleware",
            "arguments":[
               {
                  "mocks":{
                     "folder":"path:./mocks",
                     "structure":["scenario"]
                  },
                  "wrappers":{
                     "enabled":"config:middleware.mocking.enabled",
                     "mappings":[
                        {
                           "prefix":"serviceA",
                           "wrapper":"path:./lib/wrappers/serviceAWrapper",
                           "replace":"path:./lib/service/invokerA"
                        },
                        {
                           "prefix":"serviceB",
                           "wrapper":"path:./lib/wrappers/serviceBWrapper",
                           "replace":"path:./lib/service/invokerB"
                        }
                     ]
                  }
               }
            ]
         }
      }
   }
}
```

**Note:**  `path:` is relative to application root folder

### Options
* `mocks.folder` is the root mock folder.
* `mocks.structure` is used to describe the folders inside the root mock folder
  * An example URL - http://localhost:8080?scenarios=happy
  * A 'happy' folder should be created in the root folder
  * The parameter accepts an array of Strings, therefore folders can be nested
    * `{ "structure" : ["scenarios", "cases"] }`
    * An example URL - http://localhost:8080?scenarios=happy&cases=graduation
* `wrappers.enabled` will disable all mocking capability during middleware bootstrapping
* `wrappers.mappings` contains an array of mock mappings
  * `wrappers.mappings.replace` is the function to be replaced
  * `wrappers.mappings.wrapper` is the function that will wrap around the 'replace function'
  * in the each structured folder, json mocks are prefixed like `serviceA.1.json`
    * each time a 'replace function' is called the corresponding index is incremented i.e. `serviceA.2.json`
* Append `reset=1` to the URL to reset the indexes - http://localhost:8080?scenarios=happy&reset=1

You can refer to the examples/tests for further explanation

## License

The MIT License (MIT)

Copyright (c) 2016 PayPal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
