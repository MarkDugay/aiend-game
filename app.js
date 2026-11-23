const $=id=>document.getElementById(id);let world,selected=null,paused=false,timer;
const seed=()=>({day:1,hour:9,minute:0,cash:125000,employees:[
{id:'a1',name:'Alex Rivera',role:'Software Developer',dept:'Technology',personality:'Curious and thoughtful',mood:78,energy:82,hunger:22,x:320,y:205,color:'#d88a58',state:'working',phase:1},
{id:'a2',name:'Mia Santos',role:'HR Manager',dept:'Human Resources',personality:'Friendly and organized',mood:88,energy:90,hunger:18,x:430,y:205,color:'#e7b18a',state:'working',phase:2},
{id:'a3',name:'Noah Cruz',role:'Marketing Specialist',dept:'Marketing',personality:'Creative and outgoing',mood:70,energy:68,hunger:48,x:545,y:285,color:'#8ba7d9',state:'working',phase:3},
{id:'a4',name:'Luna Reyes',role:'Accountant',dept:'Finance',personality:'Careful and analytical',mood:82,energy:75,hunger:35,x:690,y:205,color:'#b7a0d9',state:'working',phase:4},
{id:'a5',name:'Ethan Lim',role:'Operations Assistant',dept:'Operations',personality:'Practical and calm',mood:75,energy:88,hunger:15,x:330,y:390,color:'#86c5a4',state:'working',phase:5},
{id:'a6',name:'Sofia Garcia',role:'Graphic Designer',dept:'Creative',personality:'Imaginative and sensitive',mood:91,energy:62,hunger:55,x:470,y:390,color:'#e7a6b5',state:'working',phase:6}],tasks:[],hires:[],feed:['The company opened its doors. Welcome, Owner!'],next:7});
function load(){try{return JSON.parse(localStorage.getItem('livingCorpSave'))||seed()}catch{return seed()}}world=load();
function save(){localStorage.setItem('livingCorpSave',JSON.stringify(world))}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function log(s){world.feed.unshift(s);world.feed=world.feed.slice(0,30);save()}
function render(){ $('cash').textContent='₱'+world.cash.toLocaleString('en-PH');$('clock').textContent=`DAY ${world.day} · ${String(world.hour).padStart(2,'0')}:${String(world.minute).padStart(2,'0')}`;$('headcount').textContent=world.employees.length;$('count').textContent=world.employees.length;PixelOffice.set(world.employees);PixelOffice.select(selected);
$('employees').innerHTML=world.employees.map(e=>`<div class="person ${selected===e.id?'selected':''}" data-id="${e.id}"><span class="swatch" style="background:${e.color}"></span><div><b>${esc(e.name)}</b><small>${esc(e.role)} · ${esc(e.dept)}</small></div><span class="state">${e.state}</span></div>`).join('');
document.querySelectorAll('.person').forEach(el=>el.onclick=()=>choose(el.dataset.id));
$('taskEmployee').innerHTML=world.employees.map(e=>`<option value="${e.id}">${esc(e.name)} — ${esc(e.role)}</option>`).join('');
let pending=[...world.tasks.filter(x=>x.status==='pending').map(x=>({...x,kind:'task'})),...world.hires.filter(x=>x.status==='pending').map(x=>({...x,kind:'hire'}))];$('pendingCount').textContent=pending.length;
$('approvals').innerHTML=pending.length?pending.map(p=>`<div class="approval"><b>${p.kind==='task'?'TASK':'HR HIRE'}: ${esc(p.title||p.name)}</b><p>${p.kind==='task'?`For ${esc(world.employees.find(e=>e.id===p.employeeId)?.name||'employee')}: ${esc(p.description)}`:`${esc(p.role)} · ${esc(p.dept)}`}</p><div class="actions"><button class="yes" data-yes="${p.id}">✓ APPROVE</button><button class="no" data-no="${p.id}">✕ REJECT</button></div></div>`).join(''):'<p class="muted">No pending requests.</p>';
document.querySelectorAll('[data-yes]').forEach(b=>b.onclick=()=>decision(b.dataset.yes,true));document.querySelectorAll('[data-no]').forEach(b=>b.onclick=()=>decision(b.dataset.no,false));$('feed').innerHTML=world.feed.map(x=>`<div class="feeditem">▸ ${esc(x)}</div>`).join('')}
function choose(id){selected=id;let e=world.employees.find(x=>x.id===id);PixelOffice.select(id);$('chatName').textContent=e.name;$('chatInput').disabled=false;$('send').disabled=false;$('chatLog').innerHTML=`<div class="bubble"><b>${esc(e.name)}</b><br>Hello, boss! How are you today? I'm feeling ${e.mood>75?'pretty good':'a little tired'}.</div>`;render()}
window.addEventListener('worker-selected',e=>choose(e.detail));
function bubble(s,owner=false){let d=document.createElement('div');d.className='bubble'+(owner?' owner':'');d.innerHTML=esc(s);$('chatLog').append(d);$('chatLog').scrollTop=$('chatLog').scrollHeight}
$('chatForm').onsubmit=e=>{e.preventDefault();let msg=$('chatInput').value.trim(),emp=world.employees.find(x=>x.id===selected);if(!msg||!emp)return;$('chatInput').value='';bubble(msg,true);let m=msg.toLowerCase(),reply;
if(/how are|kumusta|feeling/.test(m))reply=`I'm ${emp.mood>75?'doing well':'a bit stressed'}, boss. My energy is ${Math.round(emp.energy)}% and hunger is ${Math.round(emp.hunger)}%.`;
else if(/family|life|outside work/.test(m))reply='I hope to have a life outside the office too. Maybe someday I can build a family, make friends, and enjoy my hobbies. Work-life balance matters to me.';
else if(/idea|suggest/.test(m))reply=`As a ${emp.role}, I think we should explore a new opportunity in ${emp.dept}. I can prepare a proposal, but I will wait for your approval before taking action.`;
else if(/task|do this|please work|start/.test(m))reply='I can take that on, boss. Please add it through Assign a Task. I will wait for your approval before starting.';
else reply=`That's interesting, boss. As ${emp.role}, I want to do good work and keep learning. What do you think we should focus on next?`;
setTimeout(()=>bubble(reply),350)};
$('taskForm').onsubmit=e=>{e.preventDefault();world.tasks.unshift({id:'t'+Date.now(),employeeId:$('taskEmployee').value,title:$('taskTitle').value,description:$('taskDescription').value,status:'pending'});log('Owner submitted a task for approval.');$('taskForm').reset();render()};
$('hireForm').onsubmit=e=>{e.preventDefault();world.hires.unshift({id:'h'+Date.now(),name:$('hireName').value,role:$('hireRole').value,dept:$('hireDept').value,status:'pending'});log('HR submitted a hiring proposal. Owner approval required.');$('hireForm').reset();render()};
function decision(id,yes){let task=world.tasks.find(x=>x.id===id),hire=world.hires.find(x=>x.id===id);if(task){task.status=yes?'approved':'rejected';if(yes)log(`Owner approved "${task.title}". Employee may begin (execution simulation is not yet implemented).`);else log(`Owner rejected "${task.title}".`)}if(hire){hire.status=yes?'approved':'rejected';if(yes){world.employees.push({id:'a'+world.next++,name:hire.name,role:hire.role,dept:hire.dept,personality:'New team member',mood:80,energy:90,hunger:10,x:570,y:390,color:'#d7b36a',state:'working',phase:world.next});log(`${hire.name} was hired after owner approval.`)}else log(`Owner rejected the hiring proposal for ${hire.name}.`)}save();render()}
function tick(){if(paused)return;world.minute+=10;if(world.minute>=60){world.minute=0;world.hour++;if(world.hour>=24){world.hour=0;world.day++}}
world.employees.forEach(e=>{e.hunger=Math.min(100,e.hunger+1.2);if(e.state==='eating'){e.hunger=Math.max(0,e.hunger-8);e.energy=Math.min(100,e.energy+1);e.target={x:170,y:465}}else if(e.state==='resting'){e.energy=Math.min(100,e.energy+5);e.target={x:130,y:285}}else{e.energy=Math.max(0,e.energy-.7);if(e.hunger>78)e.state='eating';else if(e.energy<18)e.state='resting';}
if(e.state!=='working'&&e.hunger<30&&e.energy>45)e.state='working';if(e.state==='working'&&Math.random()<.07){let d=desks[Math.floor(Math.random()*desks.length)];e.target={x:d[0],y:d[1]-12}}e.mood=Math.max(10,Math.min(100,e.mood+(e.energy<20?-.3:.1)))});
save();render()}
const desks=[[320,245],[430,245],[545,245],[690,245],[320,420],[430,420],[545,420],[690,420],[800,245],[800,420]];
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=paused?'▶ RESUME':'Ⅱ PAUSE'};
$('reset').onclick=()=>{if(confirm('Reset your entire local company save?')){world=seed();selected=null;save();render();$('chatLog').innerHTML='<p class="muted">Select an employee to start a conversation.</p>'}};
render();timer=setInterval(tick,4500);
