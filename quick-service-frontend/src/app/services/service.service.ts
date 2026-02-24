import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServiceService {

  api = 'http://localhost:5000/api/services';

  constructor(private http: HttpClient) {}

  // USER – get services
 getServices() {
  return this.http.get<any[]>(this.api); // 👈 TYPE FIX
}
  // ADMIN – add service  ✅ (YE MISS THA)
  addService(data: any) {
    return this.http.post(this.api + '/add', data);
  }
}