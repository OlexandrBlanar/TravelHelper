import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { wikiUrl } from '../constants/constants';

@Injectable()
export class InfoPlaceService {

  constructor( private http: HttpClient  ) { }

  getWikiInfo(placeName: string) {
    const url = this.searchUrl(placeName, wikiUrl);
    return this.http.jsonp(url, 'callback')
      .map(response => (response as any).query.pages)
      // .map((results: any[]) => results.map((result) => console.log(result)))
      .map(result => result[Object.keys(result)[0]]);

  }

  searchUrl(term: string, base: string): string {
    const params = new HttpParams()
      .append('action', 'query')
      .append('format', 'json')
      .append('generator', 'search')
      .append('gsrsearch', term)
      .append('gsrnamespace', '0')
      .append('gsrlimit', '1')
      .append('prop', 'extracts')
      .append('exchars', '300')
      .append('exlimit', 'max')
      .append('explaintext', 'true')
      .append('exintro', 'true');
    return `${base}?${params.toString()}`;
  }

}
