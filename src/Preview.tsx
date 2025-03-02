import { PreviewTemplateComponentProps, CmsConfig } from "decap-cms-core";

import css from "./main.css?inline";
import { createTransform } from "./decap-utils";
import { useRef, useState, useEffect } from "react";
import { getPathForSlug } from "./decap-utils/match";

function useTransform({
  getCollection,
  getAsset,
  config,
}: PreviewTemplateComponentProps) {
  return useRef(
    createTransform({
      load: async (type, slug) => {
        const doc = await getCollection(type, slug);
        const data = (doc as any).get("data");
        if (Object.keys(data).length === 0) {
          return null;
        }
        data.slug = slug;
        return data;
      },
      loadAll: async (type) => {
        const entries = await getCollection(type);
        return entries.map((entry) => {
          //TODO: add slug
          return entry.get("data");
        });
      },
      getAsset: (path) => {
        const asset: any = getAsset(path);
        if (!asset || asset.path === "empty.svg") {
          return path;
        }
        return `${asset.url}#path=${path}`;
      },
      getHref: (collectionName, slug) => {
        const collection = (config as any as CmsConfig).collections.find(
          (c) => c.name === collectionName
        );
        if (!collection) return slug;
        return getPathForSlug(collection, slug, true);
      },
    })
  ).current;
}

function useSettings(
  props: PreviewTemplateComponentProps,
  transform: ReturnType<typeof useTransform>
) {
  const { config, getCollection } = props;
  const { collections } = config as any as CmsConfig;
  const [settings, setSettings] = useState<any>(null);
  const fields =
    collections.find((c) => c.name === "settings")?.files?.[0].fields ?? [];
  useEffect(() => {
    getCollection("settings").then(([settings]) => {
      transform(settings.get("data"), fields).then(setSettings);
    });
  }, [transform]);
  return settings;
}

function useData(
  props: PreviewTemplateComponentProps,
  transform: ReturnType<typeof useTransform>
) {
  const { entry, fields } = props;
  const [data, setData] = useState<any>();
  useEffect(() => {
    transform(entry.getIn(["data"]), fields.toJS()).then((value) => {
      value.slug = entry.getIn(["slug"]);
      setData(value);
    });
  }, [entry, transform, fields]);
  return data;
}

function useDecapLinks(doc: Document) {
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor?.href) return;

      const url = new URL(anchor.href);

      // Only handle internal links
      if (url.origin !== window.location.origin) return;

      const previewMatch = url.hash.match(/^#preview=([^/]+)\/(.*)$/);
      if (!previewMatch) return;

      e.preventDefault();

      const [, collection, slug] = previewMatch;
      location.hash = `/collections/${collection}/entries/${slug}`;
      location.reload();
    };

    doc.addEventListener("click", handleClick, { capture: true });
    return () =>
      doc.removeEventListener("click", handleClick, { capture: true });
  }, []);
}

type PreviewProps = PreviewTemplateComponentProps & {
  layout?: React.ComponentType<{ data: any; settings: any }>;
};

export function Preview(props: PreviewProps) {
  useDecapLinks(props.document);
  const transform = useTransform(props);
  const settings = useSettings(props, transform);
  const data = useData(props, transform);
  if (!data || !settings) return null;
  return (
    <div lang="de">
      <style>{css}</style>
      {props.layout && <props.layout data={data} settings={settings} />}
    </div>
  );
}
