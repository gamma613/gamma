export const ROUTES = {
  'mixes': function(slug?: string) {
    const root = `/mixes${slug ? `/${slug}` : ''}`;
    return {
      root,
      art: (type: string) => `${root}/art/${type}`
    }
  },
}