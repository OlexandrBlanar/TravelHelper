import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { wikiUrl } from '../constants/constants';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class InfoPlaceService {

  constructor( private http: HttpClient  ) { }

  getWikiInfo(placeName: string) {
    const url = this.searchUrl(placeName);
    return this.http.jsonp(url, 'callback')
      .map(response => {
        if (!(response as any).query) {
          response.query.pages = '';
          return response.query.pages;
        }
        return (response as any).query.pages;
      })
      .map(result => result[Object.keys(result)[0]]);
      // .switchMap(wikiInfo => {
      //   return this.getWikiPageUrl((wikiInfo as any).pageId, wikiUrl);
      // });

  }

  searchUrl(term: string): string {
    const params = new HttpParams()
      .append('action', 'query')
      .append('format', 'json')
      .append('generator', 'search')
      .append('gsrsearch', term)
      .append('gsrnamespace', '0')
      .append('gsrlimit', '1')
      .append('prop', 'extracts')
      .append('inprop', 'url')
      .append('exchars', '300')
      .append('exlimit', 'max')
      .append('explaintext', 'false')
      .append('exintro', 'false');
    return `${wikiUrl}?${params.toString()}`;
  }

  getWikiPageUrl(pageId: string) {
    const params = new HttpParams()
      .append('action', 'query')
      .append('format', 'json')
      .append('prop', 'info')
      .append('pageids', pageId)
      .append('inprop', 'url');
    const url = `${wikiUrl}?${params.toString()}`;
    return this.http.jsonp(url, 'callback')
      .map(response => (response as any).query.pages)
      .map(result => result[Object.keys(result)[0]]);;
  }
}
