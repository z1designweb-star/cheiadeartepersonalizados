
export const formatDriveUrl = (url: string): string => {
  if (!url) return '';
  
  // Se for um link do Google Drive, tenta extrair o ID
  if (url.includes('drive.google.com')) {
    // Padrão 1: /d/ID/view
    // Padrão 2: ?id=ID
    const idMatch = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
    const id = idMatch ? idMatch[1] : null;
    
    if (id) {
      // Retorna o link de visualização direta
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
  }
  
  return url;
};
