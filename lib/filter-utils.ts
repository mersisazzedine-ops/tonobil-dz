import { Car } from './mock-data'

export interface FilterState {
  priceRange: [number, number]
  yearRange: [number, number]
  brands: string[]
  carType: string
  transmission: string
  fuelType: string
  minSeats: number
  features: string[]
  instantBook: boolean
  sortBy: string
}

export const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 100000],
  yearRange: [2010, 2025],
  brands: [],
  carType: 'all',
  transmission: 'any',
  fuelType: 'any',
  minSeats: 0,
  features: [],
  instantBook: false,
  sortBy: 'recommended',
}

export function getPriceRange(cars: Car[]): [number, number] {
  const prices = cars.map(c => c.price_per_day)
  return [Math.min(...prices), Math.max(...prices)]
}

export function getYearRange(cars: Car[]): [number, number] {
  const years = cars.map(c => c.year)
  return [Math.min(...years), Math.max(...years)]
}

export function filterCars(cars: Car[], filters: FilterState): Car[] {
  let result = cars.filter(car => {
    if (car.price_per_day < filters.priceRange[0] || car.price_per_day > filters.priceRange[1]) return false
    if (car.year < filters.yearRange[0] || car.year > filters.yearRange[1]) return false
    if (filters.brands.length > 0 && !filters.brands.includes(car.make)) return false
    if (filters.carType !== 'all' && car.car_type !== filters.carType) return false
    if (filters.transmission !== 'any' && car.transmission !== filters.transmission) return false
    if (filters.fuelType !== 'any' && car.fuel_type !== filters.fuelType) return false
    if (filters.minSeats > 0 && car.seats < filters.minSeats) return false
    if (filters.features.length > 0 && !filters.features.every(f => car.features.includes(f))) return false
    if (filters.instantBook && !car.instant_book) return false
    return true
  })

  switch (filters.sortBy) {
    case 'price_asc': result.sort((a, b) => a.price_per_day - b.price_per_day); break
    case 'price_desc': result.sort((a, b) => b.price_per_day - a.price_per_day); break
    case 'newest': result.sort((a, b) => b.year - a.year); break
    case 'top_rated': result.sort((a, b) => b.rating - a.rating); break
    default: result.sort((a, b) => b.rating - a.rating)
  }
  return result
}
