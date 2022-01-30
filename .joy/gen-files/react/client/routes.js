

export const joyReactAutoGenRoutes = {
  name: "joyReactAutoGenRoutes",
  type: Array,
  useValue:   [
    {
      path: "/404",
      
      
      
      
      componentName: "joyErrorComponent",
      
      componentModule: require("/Users/wangyi767/Desktop/symph/symph-joy/packages/joy/dist/pages/_error.js"),
    children:   [
  ]

    },
    {
      path: "/login",
      
      index: true,
      
      
      componentName: "loginController",
      
      componentModule: require("/Users/wangyi767/Desktop/symph/symph-joy/packages/joy-admin/src/client/pages/login/index.tsx"),
    children:   [
  ]

    },
    {
      path: "/register",
      
      index: true,
      
      
      componentName: "registerController",
      
      componentModule: require("/Users/wangyi767/Desktop/symph/symph-joy/packages/joy-admin/src/client/pages/register/index.tsx"),
    children:   [
  ]

    },
  ]

}
