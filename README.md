# ts-jest-module

typescript jest test module

## TODO

- [x] tsconfig 파일 작성하기
- [x] webpack.config 파일에 ts 모듈 추가하기
- [x] 웹팩 빌드 시 build 디렉토리 비우기(develop,prod mode 인지에 따라서 파일이 달라질 수 있으니)
- [x] webpack.config에 html 플러그인 추가
- [x] webpack을 development 모드와 production 나눠보기
- [x] 타입스크립트 코드 빌드 해보기
- [ ] 타입스크립트 테스트 코드 환경 추가하기
- [ ] 타입스크립트 테스트 코드 추가하기
- [ ] 통합 테스트 코드 추가하기

### tsconfig 파일 작성하기

우선 타입스크립트 코드를 작성하기 위해서 설치를 하자.

```cmd
npm i typescript # 타입스크립트 설치
npm i @types/node # compilerOptions.lib 추가를 위해 설치
```

```js
{
  "include": ["src"],
  //include는 타입스크립트를 작성할 위치. 그래서 src를 추가해주었음
  "compilerOptions": {
    //compilerOptions는 컴파일 옵션들을 적는 곳이다.
    "outDir": "build",
    //이것은 타입스크립트로 컴파일한 후 결과물이 만들어 질 곳이다.
    //웹팩과 똑같은 위치로 잡아주었음
    "target": "ES5",
    //브라우저에서 실행되어야 하기 때문에 컴파일 코드 타겟(변환시 목표로 하는 문법)은 es5로 설정하였음
    "module": "UMD",
    //module은 코드 부분은 모든 모듈형태에서 사용할 수 있도록 Universal Module Definition 형태가 되어야 해서 UMD로 설정
    "lib": ["ES5", "DOM"]
    //lib에 DOM, ES5 등을 추가해서 어떤 환경에서 작동할 것인지를 알려주면 타입스크립트의 call signature로 도움 받을 수 있음
  }
}
```

### webpack.config 파일에 ts 모듈 추가하기

과정에 필요한 것들을 설치해보자.

```bash
npm i -D webpack webpack-cli
# 웹팩 패키지와 웹팩을 커맨드 라인에서 사용할 수 있게 해주는 webpack-cli를 설치하자
npm i -D ts-loader
# 웹팩은 기본적으로 js나 json만 해석 가능. 타입스크립트를 자바스크립트로 컴파일해주는 ts-loader를 설치해준다.
```

그리고 webpack.config.js 파일을 만들고 아래 내용을 넣었다.

```js
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
  },
};
```

> resolve를 설정해주지 않으면 작동이 되지 않았음  
> Field 'browser' doesn't contain a valid alias configuration using description file  
> 이라고 하면서 빌드가 되지 않았음

```ts
const constants = require("./constants");

const testFun = (a: number, b: number): string => {
  console.log(constants.PAYMENT_WRAPPER);
  return `${constants.IFRAME_WRAPPER} ${a + b}`;
};

const re = testFun(5, 10);
console.log(re);
```

/src/index.ts 파일을 임시적으로 위와 같이 만들고 빌드해봤는데 제대로 빌드가 되고 실행이 되는 것을 확인함

### 웹팩 빌드 시 build 디렉토리 비우기

development 모드에서는 index.html 파일을 만들어 index.js 파일을 자동 주입이 되게 하고, prod 모드에서는 index.js 파일만 만들도록 하기 위해서는 웹팩을 빌드할 때마다 build 폴더를 자동으로 비워주는 기능이 필요하다.

[clean-webpack-plugin 확인하기](https://www.npmjs.com/package/clean-webpack-plugin)

기본적인 사용법은 해당 모듈은 output.path를 확인해서 디렉토리는 놔두고 그 안에 파일을 한번 지운다.

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  plugins: [new CleanWebpackPlugin()],
};
```

위와 같은 식으로 사용하면 된다.

### webpack.config에 html 플러그인 추가

html template plugin은 HTML을 동적으로 생성할 수 있는 플러그인이다.

```bash
 npm i -D html-webpack-plugin
```

해당 형태로 다운로드 할 수 있다.

```js
// webpack.config.js

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [new HtmlWebpackPlugin()],
};
```

기본적으로 위와 같은 형태로 만들면 output.path에 index.html을 만들어줄것이다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Webpack App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script defer src="index.js"></script>
  </head>
  <body></body>
</html>
```

기본 형태는 위와 같고, 빌드한 결과물(스크립트 파일)을 주입시켜서 만들어주는 형태이다. 여기에서 기존에 있는 html 파일을 활용해서 스크립트 파일을 추가하고 싶다면 template 속성을 이용하면 된다.

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: true,
    }),
  ],
};
```

위처럼 옵션을 주면 기존에 src/index.html 파일에 빌드된 스크립트를 추가해주는 형태로 결과물이 만들어질 것이다.  
minify 속성에 true를 주었기 때문에 압축된 형태의 html이 나오게 된다.

### webpack을 development 모드와 production 나눠보기

development와 production의 빌드 목표는 다르다. 해당 프로젝트에서도 development에서는 빌드 결과물을 index.html에 바로 삽입한 결과물이 필요했고, production에서는 index.js라는 결과물만 필요한 상황이었다.  
이럴 경우 웹팩 설정을 분리하여 작성할 수 있다.  
즉 공통-dev-prod 형태로 나눠서 dev나 prod가 공통부분에 더해져서 config파일을 만들어내는 것이다.  
해당 부분을 처리하기 위해서는 webpack-merge가 필요하다.

```cmd
npm install --save-dev webpack-merge
```

해당 모듈이 webpack.[dev|prod].js 파일을 합쳐준다.

```js
// webpack.common.js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "index.js",
  },
};

//webpack.dev.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: true,
    }),
  ],
});

//webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
});
```

위의 코드를 확인해보면 웹팩의 공통 설정(entry, output, 공통 plugin, 공통 loader)은 webpack.common.js에 정의한다.  
그리고 prod나 dev에는 각자 필요한 설정만을 추가한 후에 common부분과 merge 해준다.

```json
"scripts": {
    "dev": "webpack --config webpack.dev.js",
    "prod": "webpack --config webpack.prod.js",
  }
```

그리고 스크립트를 실행할 때 --config 옵션으로 각각을 지정해주면 된다.

### 타입스크립트 테스트 코드 환경 추가하기

```bash
npm i -D jest @types/jest ts-jest
```

ts-jest는 타입스크립트 전처리기다. 해당 모듈로 타입스크립트로 적은 코드를 jest로 테스트할 수 있다.  
@types/jest는 jest의 타입 모듈이다.
