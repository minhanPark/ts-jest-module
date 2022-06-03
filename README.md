# ts-jest-module

typescript jest test module

## TODO

- [x] tsconfig 파일 작성하기
- [ ] webpack.config 파일에 ts 모듈 추가하기
- [ ] webpack.config에 html 플러그인 추가
- [ ] webpack을 development 모드와 production 나눠보기
- [ ] 타입스크립트 코드 빌드 해보기
- [ ] 타입스크립트 테스트 코드 환경 추가하기
- [ ] 타입스크립트 테스트 코드 추가하기
- [ ] 통합 테스트 코드 추가하기

### tsconfig 파일 작성하기

우선 타입스크립트 코드를 작성하기 위해서 설치를 하자.

```cmd
npm i typescript # 타입스크립트 설치
npm i @types/node # compilerOptions.lib 추가를 위해 설치
```

```json
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
