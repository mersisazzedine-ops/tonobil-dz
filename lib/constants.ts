export const COLORS = {
  primary: '#1EAAF1',
  primaryDark: '#0E82B1',
  text: '#1A1A1A',
  textLight: '#666666',
  background: '#FFFFFF',
  backgroundLight: '#F5F7FA',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  rating: '#FFB81C',
};

export const CURRENCY = {
  code: 'DZD',
  symbol: 'DA',
  position: 'suffix',
};

export const CAR_FEATURES = {
  ac: { label: 'Climatisation', icon: '❄️' },
  wifi: { label: 'WiFi', icon: '📡' },
  gps: { label: 'GPS Navigation', icon: '🗺️' },
  bluetooth: { label: 'Bluetooth', icon: '🔗' },
  backup_camera: { label: 'Caméra de recul', icon: '📹' },
  cruise_control: { label: 'Régulateur de vitesse', icon: '🎚️' },
  parking_sensors: { label: 'Capteurs de stationnement', icon: '🅿️' },
  usb_charging: { label: 'Charge USB', icon: '🔌' },
  apple_carplay: { label: 'Apple CarPlay', icon: '🍎' },
  child_seat: { label: 'Siège enfant', icon: '👶' },
  sunroof: { label: 'Toit ouvrant', icon: '☀️' },
} as const;

export const ALGERIAN_WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi',
  'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt',
  'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla',
  'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar',
  'Ouled Djellal', 'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet',
  "El M'Ghair", 'El Meniaa'
];

export const ALGERIAN_CITIES = [
  { name: 'Alger', wilaya: 'Alger', ar: 'الجزائر', carCount: 2400, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Botanical_Garden_Hamma.jpg/960px-Botanical_Garden_Hamma.jpg' },
  { name: 'Oran', wilaya: 'Oran', ar: 'وهران', carCount: 890, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Oran_-_aerial_view.jpg/960px-Oran_-_aerial_view.jpg' },
  { name: 'Constantine', wilaya: 'Constantine', ar: 'قسنطينة', carCount: 560, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Constantine_bridge_in_spring.jpg/960px-Constantine_bridge_in_spring.jpg' },
  { name: 'Annaba', wilaya: 'Annaba', ar: 'عنابة', carCount: 280, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Ville_de_Annaba.jpg/960px-Ville_de_Annaba.jpg' },
  { name: 'Tlemcen', wilaya: 'Tlemcen', ar: 'تلمسان', carCount: 210, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Grande_Mosqu%C3%A9e_de_Tlemcen.jpg/960px-Grande_Mosqu%C3%A9e_de_Tlemcen.jpg' },
  { name: 'Sétif', wilaya: 'Sétif', ar: 'سطيف', carCount: 195, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ain_el_Fouara.jpg/960px-Ain_el_Fouara.jpg' },
  { name: 'Blida', wilaya: 'Blida', ar: 'البليدة', carCount: 340, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Chrea_National_Park.jpg/960px-Chrea_National_Park.jpg' },
  { name: 'Batna', wilaya: 'Batna', ar: 'باتنة', carCount: 165, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Timgad_-_Arch_of_Trajan_02.jpg/960px-Timgad_-_Arch_of_Trajan_02.jpg' },
];

export const CAR_BRANDS = [
  'Toyota', 'Hyundai', 'Kia', 'Renault', 'Dacia', 'Peugeot', 'Volkswagen',
  'BMW', 'Mercedes-Benz', 'Mitsubishi', 'Honda', 'Nissan', 'Suzuki', 'Chevrolet', 'Audi',
];

export const CAR_TYPES = [
  { id: 'all', label: 'Tous', icon: '🚗' },
  { id: 'sedan', label: 'Berline', icon: '🚗' },
  { id: 'suv', label: 'SUV', icon: '🚙' },
  { id: 'hatchback', label: 'Citadine', icon: '🚙' },
  { id: 'minivan', label: 'Monospace', icon: '🚐' },
  { id: 'pickup', label: 'Pick-up', icon: '🛻' },
  { id: 'luxury', label: 'Luxe', icon: '✨' },
];

export const TRANSMISSION_TYPES = ['Automatique', 'Manuelle'];
export const FUEL_TYPES = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
