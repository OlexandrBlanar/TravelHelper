import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { wikiUrl } from '../../shared/constants';

@Injectable()
export class InfoPlaceService {

  constructor( private http: HttpClient  ) { }

  getWikiInfo(placeName: string) {
    const url = this.searchUrl(placeName, wikiUrl);
    this.http.jsonp(url, 'callback')
      .map((response: Response) => response[1])
      // .map((results: any[]) => results.map((result) => console.log(result)))
      .subscribe(results => console.log(results));

  }

  searchUrl(term: string, base: string): string {
    const params = new HttpParams()
      .append('action', 'opensearch')
      .append('search', term)
      .append('format', 'json');
    return `${base}?${params.toString()}`;
  }

}
