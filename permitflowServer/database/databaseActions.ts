import sqlite3 from 'sqlite3';
import { config, tables } from './config';

const db = new sqlite3.Database(config.databasePath);


