import { Request } from 'express';
import { dataSource } from './data-source';

export const EndPointAuthorizer = async (req: Request, providerKey: string) => {
  const data = await dataSource.query(
    `select * from get_user_with_permission('${providerKey}')`,
  );
  if (data[0].user_id === 0) { 
    return null;
  }
  return data;
};

export const GetURLFromPath = (url: string): string => {
  const path = url.split('?')[0];
  const arr = path.split('/');
  let dbEndPoint = '';
  arr.forEach((element) => {
    let tmpSep = element.trim();
    if (!isNaN(parseInt(tmpSep)) && tmpSep.length > 0) {
      tmpSep = '{id}';
    }
    if (tmpSep != '') {
      dbEndPoint += '/' + tmpSep;
    }
  });
  dbEndPoint = dbEndPoint.replace('//', '/');
  return dbEndPoint;
};
