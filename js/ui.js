'use strict';

var _prog=null;

function applyToForm(p){
  function sv(id,v){
    var el=document.getElementById(id);if(!el)return;
    var val=(v&&v!=='null'&&v!==null&&v!=='')?String(v):'';
    el.value=val;el.className=val?'fi filled':'fi';
  }
  sv('fop',p.operator);
  sv('fic',p.icao?p.icao.toUpperCase():null);
  sv('frt',p.route);sv('frg',p.registration);
  sv('fdt',p.flight_date);sv('fls',p.lsa_gsa);
  var idate=p.issue_date;
  if(!idate||idate==='null'){var td=new Date();idate=td.getDate()+'/'+(td.getMonth()+1);}
  sv('fidate',idate);
  if(p.status)document.getElementById('fstatus').value=p.status;
  document.getElementById('ext-panel').style.display='block';
  function se(id,v){document.getElementById(id).textContent=(v&&v!=='null'&&v!==null&&v!=='')?v:'—';}
  se('ex-op',p.operator);se('ex-ic',p.icao);se('ex-rt',p.route);se('ex-rg',p.registration);
  se('ex-dt',p.flight_date);se('ex-ls',p.lsa_gsa);se('ex-id',idate);se('ex-st',p.status||'COMPLETE');
  if(p.legs&&p.legs.length>0){
    document.getElementById('legs-wrap').style.display='block';
    var tb=document.getElementById('legs-body');tb.innerHTML='';
    p.legs.forEach(function(l){
      var tr=document.createElement('tr');
      function legTd(val){var td=document.createElement('td');td.textContent=val||'';return td;}
      tr.appendChild(legTd(l.fno));tr.appendChild(legTd(l.date||l.dt));
      tr.appendChild(legTd(l.from));tr.appendChild(legTd(l.dep));
      tr.appendChild(legTd(l.to));tr.appendChild(legTd(l.arr));
      tb.appendChild(tr);
    });
  } else {document.getElementById('legs-wrap').style.display='none';}
}

function setAIS(state,msg){
  var el=document.getElementById('ai-status');
  var ico=document.getElementById('ai-ico');
  var txt=document.getElementById('ai-msg');
  el.className='ai-status ai-'+state;
  if(state==='idle'){ico.className='';ico.textContent='⬜';txt.textContent='في انتظار إدخال بيانات الرحلة...';}
  else if(state==='thinking'){ico.className='spin';ico.textContent='⚙️';txt.textContent=msg||'جاري التحليل...';}
  else if(state==='done'){ico.className='';ico.textContent='✅';txt.textContent=msg||'تم التحليل والتعبئة';}
  else if(state==='err'){ico.className='';ico.textContent='⚠️';txt.textContent=msg||'خطأ';}
}

function startProg(){
  var pf=document.getElementById('pfill');
  pf.style.width='0%';pf.style.background='#1a5fb5';
  var p=0;_prog=setInterval(function(){p=Math.min(p+5,88);pf.style.width=p+'%';},180);
}

function endProg(ok){
  clearInterval(_prog);
  var pf=document.getElementById('pfill');
  pf.style.width='100%';pf.style.background=ok?'#1D9E75':'#e24b4a';
  setTimeout(function(){pf.style.width='0%';pf.style.background='#1a5fb5';},2500);
}

function drawRecs(){
  var fc=document.getElementById('flt-cat').value;
  var ft=document.getElementById('flt-type').value;
  var data=recs.filter(function(r){
    if(fc!=='all'&&r.cat!==fc)return false;
    if(ft!=='all'&&r.type!==ft)return false;
    return true;
  });
  var c=document.getElementById('rcont');
  if(!data.length){c.innerHTML='<div class="emp">لا توجد سجلات.</div>';return;}
  var table=document.createElement('table');
  table.className='rt';
  table.innerHTML='<thead><tr><th>#</th><th>Permit No</th><th>Type</th><th>Issue Date</th><th>Flight Operator</th><th>ICAO</th><th>Route</th><th>REG A/C</th><th>Flight Date</th><th>LSA/GSA</th><th>Status</th><th>حذف</th></tr></thead>';
  var tbody=document.createElement('tbody');
  data.forEach(function(r,i){
    var tr=document.createElement('tr');
    function td(val,title){var cell=document.createElement('td');if(title)cell.title=val||'';cell.textContent=val||'';return cell;}
    tr.appendChild(td(String(i+1)));
    var pnoCell=document.createElement('td');var b=document.createElement('b');
    b.style.fontFamily='monospace';b.style.fontSize='13px';b.textContent=r.pno;
    pnoCell.appendChild(b);tr.appendChild(pnoCell);
    var typeCell=document.createElement('td');var span=document.createElement('span');
    span.className='bdg '+(r.cat==='ovf'?'bt':'bb');span.textContent=r.type;
    typeCell.appendChild(span);tr.appendChild(typeCell);
    tr.appendChild(td(r.idate));tr.appendChild(td(r.op,true));tr.appendChild(td(r.ic));
    tr.appendChild(td(r.rt,true));tr.appendChild(td(r.rg));tr.appendChild(td(r.fdt));tr.appendChild(td(r.ls,true));
    var stCell=document.createElement('td');stCell.style.fontSize='11px';
    stCell.textContent=r.status==='COMPLETE'?'✅ COMPLETE':'⏳ NOT COMPLETE';tr.appendChild(stCell);
    var delCell=document.createElement('td');var btn=document.createElement('button');
    btn.className='del-btn';btn.textContent='🗑';
    btn.onclick=(function(id){return function(){delRec(id);};})(r.id);
    delCell.appendChild(btn);tr.appendChild(delCell);tbody.appendChild(tr);
  });
  table.appendChild(tbody);c.innerHTML='';c.appendChild(table);
}

function drawCnt(){
  function mk(types,id,cls){
    document.getElementById(id).innerHTML=types.map(function(t){
      var used=cnt[t]-300,pct=Math.min(Math.round((used/700)*100),100);
      return '<div class="cc"><div class="ccode">'+t+'</div>'
        +'<div class="cnum '+cls+'">'+cnt[t]+'</div>'
        +'<div class="csub">صدر '+used+' · متبقٍ '+(1001-cnt[t])+'</div>'
        +'<div class="prbar"><div class="prfill" style="width:'+pct+'%;background:'+(cls?'#0a7050':'#1a5fb5')+'"></div></div></div>';
    }).join('');
  }
  mk(OVF_TYPES,'covf','t');mk(LND_TYPES,'clnd','');
}

function alrt(msg,cls){
  var b=document.getElementById('albox');
  b.innerHTML='<div class="alrt '+cls+'">'+msg+'</div>';
  setTimeout(function(){b.innerHTML='';},7000);
}