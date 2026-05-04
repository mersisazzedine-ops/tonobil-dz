import { ALGERIAN_WILAYAS } from './constants';

export interface Car {
  id: string; make: string; model: string; year: number;
  price_per_day: number; deposit_amount: number; transmission: 'auto' | 'manual';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  seats: number; doors: number; mileage: number; images: string[];
  instant_book: boolean; insurance_included: boolean; host_id: string; rating: number;
  review_count: number; features: string[];
  location: { city: string; wilaya: string; address: string };
  description?: string; car_type: string; status: 'active' | 'pending';
}
export interface Host {
  id: string; name: string; avatar: string; rating: number;
  reviews_count: number; verified: boolean; response_time: string;
  bio: string; cars_count: number; member_since: string; response_rate: number;
  total_trips: number; phone: string;
}
export interface Booking {
  id: string; car_id: string; user_id: string;
  check_in: Date; check_out: Date; total_price: number;
  status: 'upcoming' | 'active' | 'past' | 'cancelled';
  host_id: string; reference_number: string;
  pickup_location: string; dropoff_location: string;
  payment_method: 'edahabia' | 'cash';
  inspection_photos?: string[];
  agreed_to_policy?: boolean;
  check_in_time?: string;
  check_out_time?: string;
}
export interface Review {
  id: string; car_id: string; user_name: string; avatar: string;
  rating: number; comment: string; date: string;
}
export interface User {
  id: string; name: string; email: string; phone: string; avatar: string;
  kyc_status: 'none' | 'pending' | 'verified';
  host_status?: 'none' | 'pending' | 'approved';
  id_document?: string; license_document?: string;
}

export const MOCK_HOSTS: Host[] = [
  { id:'host-1', name:'Mohammed Ben Ali', avatar:'MBA', rating:4.9, reviews_count:156, verified:true, response_time:'< 1 heure', bio:'Hôte de confiance.', cars_count:12, member_since:'2018-03-15', response_rate:98, total_trips:312, phone:'+213 661 23 45 67' },
  { id:'host-2', name:'Fatima Azzedine', avatar:'FA', rating:4.8, reviews_count:128, verified:true, response_time:'2 heures', bio:'Réservation instantanée.', cars_count:8, member_since:'2019-07-22', response_rate:95, total_trips:256, phone:'+213 555 98 76 54' },
  { id:'host-3', name:'Karim Saïdi', avatar:'KS', rating:4.7, reviews_count:94, verified:true, response_time:'< 1 heure', bio:'Locations familiales.', cars_count:5, member_since:'2020-01-10', response_rate:97, total_trips:188, phone:'+213 770 11 22 33' },
  { id:'host-4', name:'Laïla Boutadjine', avatar:'LB', rating:4.6, reviews_count:78, verified:false, response_time:'4 heures', bio:'Nouvel hôte.', cars_count:3, member_since:'2022-05-30', response_rate:90, total_trips:156, phone:'+213 662 33 44 55' },
  { id:'host-5', name:'Youssef Hamadi', avatar:'YH', rating:4.9, reviews_count:203, verified:true, response_time:'< 1 heure', bio:'Spécialiste voyages affaires.', cars_count:15, member_since:'2017-11-05', response_rate:99, total_trips:406, phone:'+213 551 99 88 77' },
];

export const MOCK_CARS: Car[] = [
  { id:'car-1', make:'Hyundai', model:'Tucson', year:2024, price_per_day:9500, deposit_amount:50000, transmission:'auto', fuel_type:'petrol', seats:5, doors:5, mileage:15000, images:['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=500&fit=crop'], instant_book:true, insurance_included:true, host_id:'host-1', rating:4.9, review_count:34, features:['ac','gps','bluetooth','usb_charging'], location:{city:'Alger',wilaya:'Alger',address:'Hydra'}, description:'SUV spacieux et confortable.', car_type:'suv', status:'active' },
  { id:'car-2', make:'Dacia', model:'Duster', year:2023, price_per_day:7200, deposit_amount:40000, transmission:'manual', fuel_type:'petrol', seats:5, doors:5, mileage:28000, images:['https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=500&fit=crop'], instant_book:true, insurance_included:true, host_id:'host-2', rating:4.8, review_count:42, features:['ac','gps','bluetooth'], location:{city:'Alger',wilaya:'Alger',address:'Bab Ezzouar'}, description:'Parfait pour les aventures.', car_type:'suv', status:'active' },
  { id:'car-3', make:'Renault', model:'Symbol', year:2022, price_per_day:4800, deposit_amount:30000, transmission:'manual', fuel_type:'petrol', seats:5, doors:4, mileage:45000, images:['https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&h=500&fit=crop'], instant_book:false, insurance_included:false, host_id:'host-3', rating:4.7, review_count:28, features:['ac','usb_charging'], location:{city:'Oran',wilaya:'Oran',address:'Centre'}, description:'Économique et fiable.', car_type:'sedan', status:'active' },
  { id:'car-4', make:'Mercedes-Benz', model:'Classe E', year:2023, price_per_day:20000, deposit_amount:100000, transmission:'auto', fuel_type:'petrol', seats:5, doors:4, mileage:12000, images:['https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=800&h=500&fit=crop'], instant_book:true, insurance_included:true, host_id:'host-5', rating:4.9, review_count:67, features:['ac','gps','bluetooth','apple_carplay'], location:{city:'Alger',wilaya:'Alger',address:'Chéraga'}, description:'Le luxe absolu.', car_type:'luxury', status:'active' },
  { id:'car-5', make:'Toyota', model:'Hilux', year:2022, price_per_day:11000, deposit_amount:60000, transmission:'manual', fuel_type:'diesel', seats:5, doors:4, mileage:32000, images:['https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&h=500&fit=crop'], instant_book:true, insurance_included:true, host_id:'host-1', rating:4.6, review_count:41, features:['ac','gps'], location:{city:'Sétif',wilaya:'Sétif',address:'Zone Ind'}, description:'Robuste.', car_type:'pickup', status:'active' },
  { id:'car-6', make:'Peugeot', model:'208', year:2023, price_per_day:5800, deposit_amount:30000, transmission:'auto', fuel_type:'diesel', seats:5, doors:5, mileage:18000, images:['https://images.unsplash.com/photo-1467533003447-e295ff1b0435?w=800&h=500&fit=crop'], instant_book:false, insurance_included:true, host_id:'host-5', rating:4.7, review_count:53, features:['ac','gps','bluetooth'], location:{city:'Constantine',wilaya:'Constantine',address:'Souika'}, description:'Citadine parfaite.', car_type:'hatchback', status:'active' },
  { id:'car-7', make:'Kia', model:'Picanto', year:2024, price_per_day:4000, deposit_amount:25000, transmission:'auto', fuel_type:'petrol', seats:5, doors:5, mileage:5000, images:['https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&h=500&fit=crop'], instant_book:true, insurance_included:false, host_id:'host-4', rating:4.6, review_count:19, features:['ac','bluetooth'], location:{city:'Annaba',wilaya:'Annaba',address:'Centre'}, description:'Petite citadine.', car_type:'hatchback', status:'active' },
  { id:'car-8', make:'Volkswagen', model:'Golf 8', year:2023, price_per_day:12000, deposit_amount:80000, transmission:'auto', fuel_type:'petrol', seats:5, doors:5, mileage:10000, images:['https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=500&fit=crop'], instant_book:false, insurance_included:true, host_id:'host-1', rating:5.0, review_count:12, features:['ac','gps','bluetooth','apple_carplay'], location:{city:'Oran',wilaya:'Oran',address:'Centre'}, description:'Sportive et classe.', car_type:'hatchback', status:'pending' }
];

export const MOCK_REVIEWS: Review[] = [
  { id:'rev-1', car_id:'car-1', user_name:'Ahmed Benali', avatar:'AB', rating:5, comment:'Voiture impeccable.', date:'10/12/2024' },
  { id:'rev-2', car_id:'car-2', user_name:'Sara Hamdi', avatar:'SH', rating:5, comment:'Parfaite pour notre voyage.', date:'28/11/2024' },
];

export const MOCK_CURRENT_USER: User = {
  id: 'user-123', name: 'Sarah Belkacemi', email: 'sarah@example.com', phone: '+213 661 234 567', avatar: 'SB', kyc_status: 'verified', host_status: 'approved', id_document: 'id.jpg', license_document: 'license.jpg'
};

export const MOCK_USERS: User[] = [
  MOCK_CURRENT_USER,
  { id: 'user-456', name: 'Karim Yahi', email: 'karim@test.com', phone: '+213 555 111 222', avatar: 'KY', kyc_status: 'pending', id_document: 'id.jpg', license_document: 'lic.jpg' },
  { id: 'user-789', name: 'Nadia Ziad', email: 'nadia@test.com', phone: '+213 777 333 444', avatar: 'NZ', kyc_status: 'pending', id_document: 'id2.jpg', license_document: 'lic2.jpg' },
];

export const MOCK_BOOKINGS: Booking[] = [
  { id:'booking-1', car_id:'car-1', user_id:'user-123', check_in:new Date(Date.now()-5*86400000), check_out:new Date(Date.now()+3*86400000), check_in_time:'09:00', check_out_time:'18:00', agreed_to_policy:true, total_price:52000, status:'active', host_id:'host-1', reference_number:'TNB-2025-0001', pickup_location:"Aéroport d'Alger", dropoff_location:"Aéroport d'Alger", payment_method:'edahabia' },
  { id:'booking-2', car_id:'car-2', user_id:'user-123', check_in:new Date(Date.now()+15*86400000), check_out:new Date(Date.now()+22*86400000), check_in_time:'10:30', check_out_time:'10:30', agreed_to_policy:true, total_price:62300, status:'upcoming', host_id:'host-2', reference_number:'TNB-2025-0002', pickup_location:'Bab Ezzouar, Alger', dropoff_location:'Bab Ezzouar, Alger', payment_method:'cash' },
  { id:'booking-4', car_id:'car-3', user_id:'user-123', check_in:new Date(Date.now()-45*86400000), check_out:new Date(Date.now()-40*86400000), check_in_time:'08:00', check_out_time:'20:00', agreed_to_policy:true, total_price:21000, status:'past', host_id:'host-3', reference_number:'TNB-2024-0042', pickup_location:'El Harrach, Alger', dropoff_location:'El Harrach, Alger', payment_method:'edahabia' },
];

export const MOCK_MESSAGES = [];

export function getCarById(id: string): Car | undefined { return MOCK_CARS.find(c => c.id === id); }
export function getHostById(id: string): Host | undefined { return MOCK_HOSTS.find(h => h.id === id); }
export function getBookingById(id: string): Booking | undefined { return MOCK_BOOKINGS.find(b => b.id === id); }
export function getCarsByHostId(hostId: string): Car[] { return MOCK_CARS.filter(c => c.host_id === hostId); }
export function getUserBookings(userId: string): Booking[] { return MOCK_BOOKINGS.filter(b => b.user_id === userId); }
export function getCarReviews(carId: string): Review[] { return MOCK_REVIEWS.filter(r => r.car_id === carId); }

export { ALGERIAN_WILAYAS };
