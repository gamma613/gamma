export const ROUTES = {
  music: function (slug?: string) {
    const root = `/music${slug ? `/${slug}` : ""}`;
    return {
      root,
      art: (type: string) => `${root}/art/${type.replace(/^\//, "")}`,
    };
  },
};
