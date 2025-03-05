import { ObjectField } from "./decap-types";

export type Block<T extends ObjectField = any> = {
  config: T;
  component: any;
};

type BlocksProps<T> = {
  data: T[];
};

export function blocks<const B extends Block[]>(...blocks: B) {
  return {
    types: blocks.map((b) => b.config) as B[number]["config"][],
    Blocks: ({ data }: any) => {
      /* {sections?.map((section, i) => {
        let Section: any; //TODO
        return Section ? (
          <Section key={i} {...(section as any)} />
        ) : (
          <div key={i} className="container mx-auto px-4 py-24">
            Unknown section type: {section.type}
          </div>
        );
      })} */
      return null;
    },
  };
}
