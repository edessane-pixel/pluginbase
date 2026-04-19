export interface ExternalLink {
  label: string;
  url: string;
  icon: 'search' | 'external';  // Lucide icon name
}

export function buildExternalLinks(
  pluginName: string,
  brand: string | null,
  manufacturerUrl?: string
): ExternalLink[] {
  const query = brand ? `${brand} ${pluginName}` : pluginName;
  const encoded = encodeURIComponent(query);

  const links: ExternalLink[] = [
    {
      label: 'Rechercher sur Google',
      url: `https://www.google.com/search?q=${encoded}`,
      icon: 'search',
    },
    {
      label: 'KVR Audio',
      url: `https://www.kvraudio.com/search?q=${encoded}`,
      icon: 'external',
    },
    {
      label: 'Plugin Boutique',
      url: `https://www.pluginboutique.com/search?search_query=${encoded}`,
      icon: 'external',
    },
  ];

  if (manufacturerUrl) {
    links.unshift({
      label: 'Site du fabricant',
      url: manufacturerUrl,
      icon: 'external',
    });
  }

  return links;
}
