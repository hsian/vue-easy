import config from "./menus";
import Vue from 'vue'

const load = function(path) {
  return () => import(`../pages/${path}.vue`)
};

const loopPath = function(list) {
  return (function loop(rts) {

    return rts.map((item) => {
      const routePath = item.path;

      const route = {
        path: routePath.slice(1),
        component: Vue.component(`docs-layout-parent`, function (resolve, reject) {
          resolve({
            data: () => ({routePath: routePath}),
            template: `
              <docs-layout :path="routePath">
                <IndexZhCN/>
              </docs-layout>
            `,
            components: {
              IndexZhCN: () => import(`../../components${routePath}/index.md`)
            }
          })
        }),

        meta: {
          title: item.title
        },
        children: []
      }

      if (item.list) {
        route.children = loop(item.list);
      }

      return route;
    })
  })(list);
}

const registerRoutes = function() {
  const routes = Object.keys(config).map((key) => {
    const nav = config[key];

    let route = {
      path: nav.path,
      component: load(nav.component),
      children:[]
    }
    if (nav.groups) {
      nav.groups.forEach((group) => {
        const list = group.list;

        if (list) {
          route.children = [
            ...route.children,
            ...loopPath(list)
          ];
        }
      })
    }

    return route;
  })
  return routes;
}

const routes = registerRoutes();

export default routes;