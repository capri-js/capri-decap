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

type CollectionByName<All extends CmsCollection[], N extends string> = Extract<
  All[number],
  { name: N }
>;

export type PreviewableCollectionNames<All extends CmsCollection[]> = Exclude<
  All[number],
  CollectionWithoutPreview
>["name"];

type CollectionWithoutPreview = CmsCollection & {
  editor: {
    preview: false;
  };
};

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

export type InferFieldType<
  F extends CmsField,
  All extends CmsCollection[]
> = F extends {
  widget: "hidden";
  hint?: string;
}
  ? F["hint"] extends LoadAllHint
    ? Array<
        InferDoc<CollectionByName<All, ExtractLoadAll<F["hint"]>>, All> & {
          slug: string;
          href: string;
        }
      >
    : F["hint"] extends LoadHint
    ? CollectionByName<All, ExtractLoad<F["hint"]>[0]> extends {
        files: CmsCollectionFile[];
      }
      ? InferFields<
          Extract<
            CollectionByName<All, ExtractLoad<F["hint"]>[0]>["files"][number],
            { name: ExtractLoad<F["hint"]>[1] }
          >["fields"],
          All
        >
      : InferDoc<CollectionByName<All, ExtractLoad<F["hint"]>[0]>, All>
    : never
  : F extends StringField
  ? string
  : F extends CmsFieldNumber
  ? number
  : F extends CmsFieldBoolean
  ? boolean
  : F extends CmsFieldRelation
  ? InferDoc<CollectionByName<All, F["collection"]>, All> & {
      slug: string;
      href: string;
    }
  : F extends SelectField
  ? F["options"][number]
  : F extends MultiSelectField
  ? string[]
  : F extends VariableListField
  ? Array<InferVariableListItem<F, All>>
  : F extends SingleWidgetListField
  ? Array<InferFieldType<F["field"], All>>
  : F extends MultiWidgetListField
  ? Array<InferFields<F["fields"], All>>
  : F extends ObjectField
  ? InferFields<F["fields"], All>
  : F extends CmsFieldMeta
  ? any
  : unknown;

export type InferVariableListItem<
  F extends VariableListField,
  C extends CmsCollection[]
> = {
  [K in F["types"][number] as K["name"]]: InferFields<K["fields"], C> & {
    type: K["name"];
  };
}[F["types"][number]["name"]];

export type InferFields<
  F extends readonly [...CmsField[]],
  C extends CmsCollection[]
> = {
  [K in F[number] as K["name"]]: K extends { required: false }
    ? InferFieldType<K, C> | undefined
    : InferFieldType<K, C>;
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

export type InferProps<
  F extends ObjectField,
  C extends CmsCollection[]
> = InferFields<F["fields"], C>;

export type InferDoc<
  C extends CmsCollection,
  All extends CmsCollection[]
> = InferFields<CollectionFields<C>, All> & { slug: string };
