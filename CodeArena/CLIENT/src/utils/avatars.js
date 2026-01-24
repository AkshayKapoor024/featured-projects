// Shared Avatar List
export const AVATARS = [
  { id: 1, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix' },
  { id: 2, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka' },
  { id: 3, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Zoey' },
  { id: 4, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Christopher' },
  { id: 5, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sophia' },
  { id: 6, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Brian' },
  { id: 7, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan' },
  { id: 8, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jordan' },
  { id: 9, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Kelly' },
  { id: 10, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Luis' },
  { id: 11, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Kyle' },
  { id: 12, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Jessica' },
  { id: 13, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Brook' },
  { id: 14, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Eden' },
  { id: 15, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander' },
  { id: 16, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Rochester' },
  { id: 17, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Gizmo' },
  { id: 18, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Midnight' },
  { id: 19, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Samurai' },
  { id: 20, url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Abby' },
];

export const getAvatarUrl = (idOrUrl) => {
  if (!idOrUrl) return AVATARS[0].url;
  
  // If it's an ID (number), find it
  if (typeof idOrUrl === 'number') {
    const avatar = AVATARS.find(a => a.id === idOrUrl);
    return avatar ? avatar.url : AVATARS[0].url;
  }
  
  // If it's a string
  if (typeof idOrUrl === 'string') {
    // If it's a full URL
    if (idOrUrl.startsWith('http')) return idOrUrl;
    
    // If it's a string ID (e.g. "1")
    const numId = parseInt(idOrUrl);
    if (!isNaN(numId)) {
      const avatar = AVATARS.find(a => a.id === numId);
      return avatar ? avatar.url : AVATARS[0].url;
    }
  }
  
  return AVATARS[0].url;
};