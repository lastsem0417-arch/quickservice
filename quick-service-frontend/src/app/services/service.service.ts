import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  estimatedDuration: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface ServiceResponse {
  success: boolean;
  message?: string;
  data: Service | Service[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private api = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  // GET ALL SERVICES WITH PAGINATION & FILTERING
  getServices(page = 1, limit = 12, filters?: any): Observable<ServiceResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    if (filters?.minPrice) {
      params = params.set('minPrice', filters.minPrice);
    }
    if (filters?.maxPrice) {
      params = params.set('maxPrice', filters.maxPrice);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<ServiceResponse>(this.api, { params });
  }

  // GET SERVICE BY ID
  getServiceById(id: string): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.api}/${id}`);
  }

  // SEARCH SERVICES
  searchServices(query: string): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.api}/search`, {
      params: new HttpParams().set('q', query)
    });
  }

  // GET SERVICES BY CATEGORY
  getServicesByCategory(category: string, page = 1, limit = 12): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.api}/category/${category}`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('limit', limit.toString())
    });
  }

  // ADD SERVICE (ADMIN ONLY)
  addService(data: any): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.api, data);
  }

  // UPDATE SERVICE (ADMIN ONLY)
  updateService(id: string, data: any): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(`${this.api}/${id}`, data);
  }

  // DELETE SERVICE (ADMIN ONLY)
  deleteService(id: string): Observable<ServiceResponse> {
    return this.http.delete<ServiceResponse>(`${this.api}/${id}`);
  }
}
