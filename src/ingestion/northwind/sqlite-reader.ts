import sqlite3 from 'sqlite3';

import {open} from 'sqlite';

import {
  NORTHWIND_DB_PATH
} from './constants';

export async function openNorthwindConnection(){

  return open({

    filename:
      NORTHWIND_DB_PATH,

    driver:
      sqlite3.Database

  });

}