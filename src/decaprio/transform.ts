import type { CmsField } from "decap-cms-core";
import immutable from "immutable";
import { isRelationField } from "./types";

type Immutable = immutable.Iterable<unknown, unknown>;

function isList(value: unknown): value is immutable.List<unknown> {
  return immutable.List.isList(value);
}

function isMap(value: unknown): value is immutable.Map<unknown, unknown> {
  return immutable.Map.isMap(value);
}

function nestedFields(f?: CmsField): CmsField[] {
  if (f) {
    if ("types" in f) {
      return f.types ?? [];
    }
    if ("fields" in f) {
      return f.fields ?? [];
    }
    if ("field" in f) {
      return f.field ? [f.field] : [];
    }
  }
  return [];
}

interface TransformOptions {
  load: (collection: string, slug: string) => Promise<unknown>;
  loadAll: (collection: string) => Promise<unknown[]>;
  getHref: (collection: string, slug: string) => string;
  getAsset?: (path: string) => string;
  inlineDocs?: boolean;
}

export function createTransform({
  load,
  loadAll,
  getAsset,
  getHref,
  inlineDocs = true,
}: TransformOptions) {
  const previousData = new Map();
  const cache = new Map();

  const transformValue = async (
    value: unknown,
    field: CmsField,
    {
      load,
      getAsset,
      getHref,
    }: Pick<TransformOptions, "load" | "getAsset" | "getHref">
  ) => {
    if (isRelationField(field) && typeof value === "string") {
      if (!inlineDocs) {
        return value;
      }
      const loadedValue = await load(field.collection, value);
      if (loadedValue) {
        (loadedValue as any).slug = value;
        (loadedValue as any).href = getHref(field.collection, value);
        return loadedValue;
      }
      console.log("Failed to load relation", field.collection, value);
      return null;
    } else if (
      getAsset &&
      field.widget === "image" &&
      typeof value === "string"
    ) {
      return getAsset(value);
    }
    return value;
  };

  const visit = async (
    value: Immutable,
    fields: CmsField[],
    path = ""
  ): Promise<Immutable> => {
    if (!fields?.length) {
      return value;
    }
    const prevValue = previousData.get(path);
    if (value === prevValue) {
      return cache.get(path) ?? value;
    }
    previousData.set(path, value);

    let result;
    if (isList(value)) {
      let newList = value;
      for (let i = 0; i < newList.size; i++) {
        const item = newList.get(i);
        if (isMap(item)) {
          const itemType = item.get("type");
          if (itemType) {
            const field = fields.find((f) => f.name === itemType);
            const newItem = await visit(
              item,
              nestedFields(field),
              `${path}.${i}`
            );
            newList = newList.set(i, newItem);
          } else {
            const newItem = await visit(item, fields, `${path}.${i}`);
            newList = newList.set(i, newItem);
          }
        } else {
          const field = fields[0];
          const transformedValue = await transformValue(item, field, {
            load,
            getAsset,
            getHref,
          });
          if (transformedValue === null) {
            newList = newList.delete(i);
            i--;
          } else if (transformedValue !== item) {
            newList = newList.set(i, transformedValue);
          }
        }
      }
      result = newList;
    } else if (isMap(value)) {
      let newMap = value;
      for (const [key, val] of newMap.entrySeq().toArray()) {
        const field = fields.find((f) => f.name === key);
        if (field) {
          const transformedValue = await transformValue(val, field, {
            load,
            getAsset,
            getHref,
          });
          if (transformedValue !== val) {
            newMap = newMap.set(key, transformedValue);
          } else {
            const newVal = await visit(
              val,
              nestedFields(field),
              `${path}.${key}`
            );
            newMap = newMap.set(key, newVal);
          }
        }
      }

      if (inlineDocs) {
        const hiddenFields = fields.filter((f) => f.widget === "hidden");
        for (const field of hiddenFields) {
          const fieldName = field.name;
          const match = field.hint?.match(
            /loadAll\(([^,]*)\)|load\((.*),(.*)\)/
          );
          if (match) {
            const [, all, collection, slug] = match;
            const loadedValue = await (slug
              ? load(collection, slug)
              : loadAll(all));
            newMap = newMap.set(fieldName, loadedValue);
          }
        }

        const relationFields = fields.filter(isRelationField);
        for (const field of relationFields) {
          const fieldName = field.name;
          const slug = value.get(fieldName);
          if (typeof slug === "string") {
            const loadedValue = await load(field.collection, slug);
            if (loadedValue) {
              (loadedValue as any).slug = slug;
              (loadedValue as any).href = getHref(field.collection, slug);
            }
            newMap = newMap.set(fieldName, loadedValue);
          }
        }
      }

      result = newMap;
    } else {
      result = value;
    }

    cache.set(path, result);
    return result;
  };

  return async (value: unknown, fields: CmsField[]) => {
    const immutableValue = isMap(value) ? value : immutable.fromJS(value);
    const transformed = await visit(immutableValue, fields);
    return transformed?.toJS();
  };
}
