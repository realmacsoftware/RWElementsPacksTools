const globalLink = (app) => {
  const { globalLink: link = null } = app.props;
  const hasLink = !!link && typeof link === 'object' && typeof link.href === 'string' && link.href.length > 0;

  let linkAttributes = {
    hasLink,
    args: {}
  };

  if (!hasLink) return linkAttributes;

  const { href, title, target } = link;
  const attrs = link.attributes?.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})

  linkAttributes.args = {
    ...attrs,
    href,
    title,
    target,
  };

  return linkAttributes;
};
