import { init, CmsConfig, CMS } from "decap-cms-app/init";
import { CollectionRegistry } from "./registry";

type Options = {
  registry: CollectionRegistry;
  css: string;
  config: Omit<CmsConfig, "collections">;
  setup: (cms: CMS) => void;
};
export function initDecapCMS({ registry, css, config, setup }: Options) {
  init({
    config: {
      ...config,
      collections: registry.collections,
    },
    async setup(cms) {
      //TODO Register previews
      for (const c of registry.collections) {
        /* CMS.registerPreviewTemplate(c.name, (props) => (
          <Preview {...props} layout={c.layout} />
        )); */
      }

      await setup(cms);
    },
  });
}
