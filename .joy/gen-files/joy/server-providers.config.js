import { MountModule } from "@symph/server";

import * as m0 from "/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/service/register.service.ts"
import * as m1 from "/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/controller/hello.controller.ts"
import * as m2 from "/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/controller/register.controller.ts"

export const ___JOY_GEN_COMPONENTS = [
  {
    path: "/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/service/register.service.ts",
    
    module: m0,
    //module: require("/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/service/register.service.ts"),
  },
  {
    path: "/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/controller/hello.controller.ts",
    
    module: m1,
    //module: require("/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/controller/hello.controller.ts"),
  },
  {
    path: "/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/controller/register.controller.ts",
    
    module: m2,
    //module: require("/Users/wangyi767/Desktop/symph-joy/packages/joy-admin/src/server/controller/register.controller.ts"),
  },
]

if (module.hot) {
  module.hot.accept();
}




