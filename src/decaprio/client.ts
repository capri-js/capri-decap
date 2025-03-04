import { Decaprio } from "./decaprio";
import { init, CmsConfig, CMS } from "decap-cms-app/init";

type Options = {
  decaprio: Decaprio<any, any>;
  css: string;
  config: Omit<CmsConfig, "collections">;
  setup: (cms: CMS) => void;
};
export function initDecapCMS({ decaprio, config, setup }: Options) {
  init({
    config: {
      ...config,
      collections: decaprio.collections,
    },
    async setup(cms) {
      //TODO Register previews
      for (const c of decaprio.collections) {
        /* CMS.registerPreviewTemplate(c.name, (props) => (
          <Preview {...props} layout={c.layout} />
        )); */
      }

      await setup(cms);
    },
  });
}
