
export const formatDriveUrl = (url: string): string => {
  if (!url) return '';
  
  const driveDomain = 'drive.google.com';
  
  if (url.includes(driveDomain)) {
    // Regex melhorada para pegar o ID entre /d/ e a próxima barra ou fim da string
    // E também suportar o formato ?id=
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const id = idMatch ? idMatch[1] : null;
    
    if (id) {
      // O endpoint 'thumbnail' é muito mais confiável para exibição em sites
      // sz=w1000 define a largura máxima para garantir boa qualidade
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
  }
  
  return url;
};
