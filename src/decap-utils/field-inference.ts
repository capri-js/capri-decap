import type {
  CmsField,
  CmsCollection,
  CmsCollectionFile,
  CmsFieldRelation,
  CmsFieldMeta,
  CmsFieldNumber,
  CmsFieldBoolean,
} from "decap-cms-core";
import type {
  ObjectField,
  StringField,
  MultiSelectField,
  VariableListField,
  SingleWidgetListField,
  MultiWidgetListField,
  SelectField,
} from "./types";
import { FunctionComponent } from "react";

type CollectionFields<C extends CmsCollection> = C extends {
  fields: CmsField[];
}
  ? C["fields"]
  : C extends { files: CmsCollectionFile[] }
  ? C["files"][number]["fields"]
  : never;

type LoadAllHint = `loadAll(${string})`;
type LoadHint = `load(${string},${string})`;

type ExtractLoadAll<H extends string> = H extends LoadAllHint
  ? H extends `loadAll(${infer C})`
    ? C
    : never
  : never;

type ExtractLoad<H extends string> = H extends LoadHint
  ? H extends `load(${infer C},${infer S})`
    ? [C, S]
    : never
  : never;

export type InferFieldType<F extends CmsField> = F extends {
  widget: "hidden";
  hint?: string;
}
  ? F["hint"] extends LoadAllHint
    ? Array<
        InferDoc<Collections[ExtractLoadAll<F["hint"]>]> & {
          slug: string;
          href: string;
        }
      >
    : F["hint"] extends LoadHint
    ? Collections[ExtractLoad<F["hint"]>[0]] extends {
        files: CmsCollectionFile[];
      }
      ? InferFields<
          Extract<
            Collections[ExtractLoad<F["hint"]>[0]]["files"][number],
            { name: ExtractLoad<F["hint"]>[1] }
          >["fields"]
        >
      : InferDoc<Collections[ExtractLoad<F["hint"]>[0]]>
    : never
  : F extends StringField
  ? string
  : F extends CmsFieldNumber
  ? number
  : F extends CmsFieldBoolean
  ? boolean
  : F extends CmsFieldRelation
  ? InferDoc<Collections[F["collection"]]> & {
      slug: string;
      href: string;
    }
  : F extends SelectField
  ? F["options"][number]
  : F extends MultiSelectField
  ? string[]
  : F extends VariableListField
  ? Array<InferVariableListItem<F>>
  : F extends SingleWidgetListField
  ? Array<InferFieldType<F["field"]>>
  : F extends MultiWidgetListField
  ? Array<InferFields<F["fields"]>>
  : F extends ObjectField
  ? InferFields<F["fields"]>
  : F extends CmsFieldMeta
  ? any
  : unknown;

export type InferVariableListItem<F extends VariableListField> = {
  [K in F["types"][number] as K["name"]]: InferFields<K["fields"]> & {
    type: K["name"];
  };
}[F["types"][number]["name"]];

export type InferFields<F extends readonly [...CmsField[]]> = {
  [K in F[number] as K["name"]]: K extends { required: false }
    ? InferFieldType<K> | undefined
    : InferFieldType<K>;
} extends infer T
  ? {
      [P in keyof T as undefined extends T[P] ? never : P]: T[P];
    } & {
      [P in keyof T as undefined extends T[P] ? P : never]?: Exclude<
        T[P],
        undefined
      >;
    }
  : never;

export type InferProps<F extends ObjectField> = InferFields<F["fields"]>;

export type InferDoc<C extends CmsCollection> = InferFields<
  CollectionFields<C>
> & { slug: string };

export type CollectionConfig<C extends CmsCollection> = {
  config: C;
  layout?: FunctionComponent<InferDoc<C>>;
};

export interface Config {}

type CollectionValues = {
  [K in keyof Config]: Config[K] extends {
    collections: CollectionConfig<any>[];
  }
    ? Config[K]["collections"][number]["config"]
    : never;
}[keyof Config];

export type Collections = {
  [K in CollectionValues["name"]]: Extract<CollectionValues, { name: K }>;
};
