'use strict';
var OVF_TYPES=['OP','OF','OCC','OCP','OG'];
var LND_TYPES=['T','CC','CP','TS','GA','MT','M'];
var ALL_TYPES=[].concat(OVF_TYPES,LND_TYPES);
var JORDAN_AP=['OJAM','OJAI','OJAQ','OJJK','OJMF','OJHF','OJHB'];
var MONTHS={JAN:'01',FEB:'02',MAR:'03',APR:'04',MAY:'05',JUN:'06',
            JUL:'07',AUG:'08',SEP:'09',OCT:'10',NOV:'11',DEC:'12'};

var TYPE_SUBTITLE={
  OP:'OP',OF:'OF',OCC:'OCC',OCP:'OCP',OG:'OG',
  T:'Private Flight (T)',CC:'Charter PAX FLIGHT (CC)',
  CP:'Charter PAX FLIGHT (CP)',TS:'Charter PAX FLIGHT (TS)',
  GA:'General Aviation (GA)',MT:'Military Transit (MT)',M:'Military (M)'
};
var HDR_OVF=['#','Permit Numbers','Issue Date','Flight operator','ICAO CODE','LSA  or GSA Name','Add complete application\nNot complete application'];
var HDR_LND=['#','Permit Numbers','Issue Date','Flight operator','ICAO CODE','Route','REG A/C','Flight Date','LSA  or GSA Name','Add complete application\nNot complete application'];