/* Productivity Dashboard - script.js
   Modular, vanilla JS. Features initialized via individual functions.
*/
(function(){
  'use strict';

  /* -------------------- Utilities -------------------- */
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const ls = { get(k, d){try{return JSON.parse(localStorage.getItem(k)) ?? d}catch(e){return d}}, set(k,v){localStorage.setItem(k,JSON.stringify(v))} };

  /* -------------------- Navigation / View handling -------------------- */
  function initNavigation(){
    const cards = qs('#cards');
    const view = qs('#feature-view');
    let active = null;

    function openFeature(name){
      if(active) return; // single active at a time
      active = name;
      view.innerHTML = ''; view.style.display = 'block';
      const panel = document.createElement('div'); panel.className='feature-panel fade-in';
      const header = document.createElement('div'); header.className='feature-header';
      header.innerHTML = `<h3>${name[0].toUpperCase()+name.slice(1)}</h3>`;
      const close = document.createElement('button'); close.className='btn'; close.textContent='Close'; close.setAttribute('aria-label','Close '+name);
      close.addEventListener('click', closeFeature);
      header.appendChild(close); panel.appendChild(header);
      // placeholder where each feature will mount content
      const mount = document.createElement('div'); mount.className='feature-body'; panel.appendChild(mount);
      view.appendChild(panel);
      // call feature init with mount element
      const fn = featureRegistry[name];
      if(fn) fn(mount);
      document.body.style.overflow = 'hidden';
    }

    function closeFeature(){
      active = null; qs('#feature-view').style.display='none'; qs('#feature-view').innerHTML=''; document.body.style.overflow = '';
    }

    cards.addEventListener('click', e => {
      const btn = e.target.closest('[data-feature]');
      if(!btn) return;
      const feature = btn.dataset.feature;
      openFeature(feature);
    });

    // expose for tests
    return { openFeature, closeFeature };
  }

  /* -------------------- Todo List -------------------- */
  function initTodo(mount){
    const KEY='pd-todos';
    let state = ls.get(KEY, []);
    // ensure each task has an id (migrate older data)
    state = state.map(t => typeof t.id !== 'undefined' ? t : ({ id: 't'+(Date.now()+Math.floor(Math.random()*10000)), text: t.text, completed: !!t.completed, important: !!t.important, due: t.due || null }));

    mount.innerHTML = `
      <div>
        <div class="controls-row" style="margin-bottom:.5rem">
          <input id="todo-input" type="text" placeholder="Add a task" />
          <input id="todo-time" type="datetime-local" />
          <button id="todo-add" class="primary">Add Task</button>
        </div>
        <div id="todo-list" class="list" role="list"></div>
      </div>`;

    const input = qs('#todo-input', mount);
    const add = qs('#todo-add', mount);
    const list = qs('#todo-list', mount);

    function render(){
      list.innerHTML='';
      state.forEach((t, i) => {
        const item = document.createElement('div'); item.className='task'+(t.completed? ' completed':''); item.dataset.index=i; item.dataset.id = t.id;
        const dueText = t.due ? ('<div style="font-size:0.85rem;color:var(--muted)">Due: '+ new Date(t.due).toLocaleString() +'</div>') : '';
        item.innerHTML = `<div class="left"><input type="checkbox" ${t.completed? 'checked':''} aria-label="Mark complete"/><div class="title">${escapeHtml(t.text)}${dueText}</div></div>
          <div class="controls-row"><button class="btn imp">${t.important? '★':'☆'}</button><button class="btn del">🗑</button></div>`;
        list.appendChild(item);
      });
    }

    function persist(){ ls.set(KEY, state); }

    add.addEventListener('click', () => { addTask(); });
    input.addEventListener('keydown', e => { if(e.key==='Enter') addTask(); });

    function addTask(){
      const txt = input.value.trim(); const timeVal = qs('#todo-time', mount).value; if(!txt) return; const id = 't'+(Date.now()+Math.floor(Math.random()*10000)); const due = timeVal ? new Date(timeVal).toISOString() : null;
      const task = { id, text:txt, completed:false, important:false, due };
      state.unshift(task); input.value=''; qs('#todo-time', mount).value=''; persist(); render();
      Notif.requestPermissionOnUserAction(); if(due) Notif.scheduleReminder(id, due, 'Task due: '+txt, 'Due '+ new Date(due).toLocaleString(), 'todo');
    }

    list.addEventListener('click', e => {
      const taskEl = e.target.closest('.task'); if(!taskEl) return; const idx = Number(taskEl.dataset.index); const task = state[idx];
      if(e.target.matches('input[type="checkbox"]')){ task.completed = e.target.checked; // remove reminder if completed
        if(task.completed) Notif.removeReminder(task.id);
        persist(); render(); return; }
      if(e.target.matches('.btn.imp')){ task.important = !task.important; persist(); render(); return; }
      if(e.target.matches('.btn.del')){ // remove reminder and task
        Notif.removeReminder(task.id); state.splice(idx,1); persist(); render(); return; }
    });

    // schedule existing reminders
    render();
    state.forEach(t => { if(t.due) Notif.scheduleReminder(t.id, t.due, 'Task due: '+t.text, 'Due '+ new Date(t.due).toLocaleString(), 'todo'); });
  }

  /* -------------------- Daily Planner -------------------- */
  function initPlanner(mount){
    const KEY='pd-planner';
    const hours = Array.from({length:13},(_,i)=>i+7); // 7..19
    let data = ls.get(KEY, {});
    // normalize stored data to {text, reminder}
    hours.forEach(h=>{
      if(typeof data[h] === 'string'){ data[h] = { text: data[h], reminder: false }; }
      if(!data[h]) data[h] = { text: '', reminder: false };
    });
    mount.innerHTML = `<div class="planner"></div>`;
    const cont = qs('.planner', mount);

    function render(){
      cont.innerHTML='';
      const nowHour = new Date().getHours();
      hours.forEach(h => {
        const slot = document.createElement('div'); slot.className='slot'+(h===nowHour? ' current':'');
        const hourLabel = document.createElement('div'); hourLabel.className='hour'; hourLabel.textContent = formatHour(h);
        const note = document.createElement('div'); note.className='note'; note.contentEditable='true'; note.dataset.hour=h; note.innerText = data[h].text || '';
        const remWrap = document.createElement('div'); remWrap.style.marginLeft='8px'; remWrap.innerHTML = `<label style="font-size:0.85rem;color:var(--muted)"><input type="checkbox" ${data[h].reminder? 'checked':''}/> Reminder</label>`;
        note.addEventListener('blur', ()=>{ data[h].text = note.innerText.trim(); ls.set(KEY,data); });
        remWrap.querySelector('input').addEventListener('change', (ev)=>{
          data[h].reminder = ev.target.checked; ls.set(KEY,data);
          if(ev.target.checked){ // schedule for this hour (today or next day)
            const now = new Date(); const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, 0, 5, 0); // slight offset
            if(target.getTime() <= Date.now()) target.setDate(target.getDate()+1);
            Notif.requestPermissionOnUserAction(); Notif.scheduleReminder('planner-'+h+'-'+target.getTime(), target.toISOString(), 'Planner: '+formatHour(h), data[h].text || '', 'planner');
          } else {
            // remove any planner reminder(s) for this hour
            Notif.removeRemindersMatching(r => r.source === 'planner' && new Date(r.time).getHours() === h);
          }
        });
        slot.appendChild(hourLabel); slot.appendChild(note); cont.appendChild(slot);
        slot.appendChild(remWrap);
      });
    }

    render();
    // schedule existing planner reminders
    hours.forEach(h => {
      if(data[h] && data[h].reminder){ const now=new Date(); const target=new Date(now.getFullYear(), now.getMonth(), now.getDate(), h,0,5,0); if(target.getTime()<=Date.now()) target.setDate(target.getDate()+1); Notif.scheduleReminder('planner-'+h+'-'+target.getTime(), target.toISOString(), 'Planner: '+formatHour(h), data[h].text||'', 'planner'); }
    });
  }

  /* -------------------- Daily Goals -------------------- */
  function initGoals(mount){
    const KEY='pd-goals';
    let goals = ls.get(KEY, []);
    goals = goals.map(g => typeof g.id !== 'undefined' ? g : ({ id: 'g'+(Date.now()+Math.floor(Math.random()*10000)), text: g.text, done: !!g.done, due: g.due || null }));
    mount.innerHTML = `
      <div>
        <div class="controls-row" style="margin-bottom:.5rem">
          <input id="goal-input" type="text" placeholder="Add a daily goal" />
          <input id="goal-time" type="datetime-local" />
          <button id="goal-add" class="primary">Add Goal</button>
        </div>
        <div id="goal-stats" style="margin-bottom:.5rem;color:var(--muted)"></div>
        <div id="goal-list" class="list"></div>
      </div>`;

    const input = qs('#goal-input', mount);
    const add = qs('#goal-add', mount);
    const list = qs('#goal-list', mount);
    const stats = qs('#goal-stats', mount);

    function render(){
      list.innerHTML='';
      goals.forEach((g,i)=>{
        const el = document.createElement('div'); el.className='task'+(g.done? ' completed':''); el.dataset.index=i; el.dataset.id = g.id;
        const dueText = g.due ? ('<div style="font-size:0.85rem;color:var(--muted)">Due: '+ new Date(g.due).toLocaleString() +'</div>') : '';
        el.innerHTML = `<div class="left"><input type="checkbox" ${g.done? 'checked':''}/><div class="title">${escapeHtml(g.text)}${dueText}</div></div>
          <div class="controls-row"><button class="btn del">🗑</button></div>`;
        list.appendChild(el);
      });
      const done = goals.filter(g=>g.done).length; stats.textContent = `${done} of ${goals.length} completed`;
    }

    add.addEventListener('click', ()=>{ const t=input.value.trim(); const timeVal = qs('#goal-time', mount).value; if(!t) return; const id = 'g'+(Date.now()+Math.floor(Math.random()*10000)); const due = timeVal ? new Date(timeVal).toISOString() : null; goals.push({id, text:t,done:false, due}); input.value=''; qs('#goal-time', mount).value=''; ls.set(KEY,goals); render(); Notif.requestPermissionOnUserAction(); if(due) Notif.scheduleReminder(id, due, 'Goal due: '+t, 'Due '+ new Date(due).toLocaleString(), 'goal'); });
    input.addEventListener('keydown', e=>{ if(e.key==='Enter'){ add.click(); } });
    list.addEventListener('click', e=>{ const t = e.target.closest('.task'); if(!t) return; const i=Number(t.dataset.index); if(e.target.matches('input[type=checkbox]')){ goals[i].done = e.target.checked; if(goals[i].done) Notif.removeReminder(goals[i].id); ls.set(KEY,goals); render(); } if(e.target.matches('.btn.del')){ Notif.removeReminder(goals[i].id); goals.splice(i,1); ls.set(KEY,goals); render(); } });

    render();
    goals.forEach(g => { if(g.due) Notif.scheduleReminder(g.id, g.due, 'Goal due: '+g.text, 'Due '+ new Date(g.due).toLocaleString(), 'goal'); });
  }

  /* -------------------- Pomodoro -------------------- */
  function initPomodoro(mount){
    let intervalId=null; let remaining=25*60; let running=false; const KEY='pd-pom'; const saved=ls.get(KEY,{remaining:null}); if(saved.remaining) remaining=saved.remaining;
    mount.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:.5rem;align-items:center">
        <div id="pom-label">Work Session</div>
        <div id="pom-display" style="font-size:2rem;font-weight:700">${formatTime(remaining)}</div>
        <div class="controls-row"><button id="pom-start" class="primary">Start</button><button id="pom-pause" class="btn">Pause</button><button id="pom-reset" class="btn">Reset</button></div>
      </div>`;

    const disp = qs('#pom-display', mount); const start = qs('#pom-start', mount); const pause = qs('#pom-pause', mount); const reset = qs('#pom-reset', mount);

    function tick(){ remaining--; if(remaining<=0){ stop(); remaining=0; disp.textContent='00:00'; pomodoroNotify(); ls.set(KEY,{remaining}); return;} disp.textContent = formatTime(remaining); ls.set(KEY,{remaining}); }
    function startTimer(){ if(running) return; running=true; intervalId = setInterval(tick,1000); }
    function stop(){ running=false; clearInterval(intervalId); intervalId=null; }
    function pauseTimer(){ stop(); }
    function resetTimer(){ stop(); remaining = 25*60; disp.textContent = formatTime(remaining); ls.set(KEY,{remaining}); }

    // request notification permission on explicit user start
    start.addEventListener('click', ()=>{ Notif.requestPermissionOnUserAction(); startTimer(); });
    pause.addEventListener('click', pauseTimer); reset.addEventListener('click', resetTimer);
    disp.textContent = formatTime(remaining);

    function pomodoroNotify(){ try{ if(window.navigator && navigator.vibrate) navigator.vibrate(200); }catch(e){}
      const label = qs('#pom-label', mount).textContent || 'Pomodoro';
      Notif.requestPermissionOnUserAction(); Notif.sendNotification('pom-'+Date.now(), label + ' finished', 'Tap to return to app');
    }
  }

  /* -------------------- Quotes -------------------- */
  function initQuotes(mount){
    mount.innerHTML = `<div><blockquote id="quote" style="min-height:4rem">"..."</blockquote><div class="controls-row"><button id="new-quote" class="primary">New Quote</button></div></div>`;
    const quoteEl = qs('#quote', mount); const btn = qs('#new-quote', mount);
    async function fetchQuote(){ quoteEl.textContent='Loading…'; try{
      const res = await fetch('https://api.quotable.io/random');
      if(!res.ok) throw new Error('Network');
      const j = await res.json(); quoteEl.textContent = `"${j.content}" — ${j.author}`;
    }catch(e){ quoteEl.textContent = 'Could not load quote. Try again.'; }
    }
    btn.addEventListener('click', fetchQuote); fetchQuote();
  }

  /* -------------------- Weather -------------------- */
  function initWeather(mount){
    mount.innerHTML = `<div class="weather-grid"><div><div id="w-location"></div><div id="w-temp" style="font-size:1.6rem"></div><div id="w-cond"></div></div><div id="w-meta" style="text-align:right;color:var(--muted)"></div></div>`;
    const locEl=qs('#w-location', mount), tempEl=qs('#w-temp', mount), condEl=qs('#w-cond', mount), meta=qs('#w-meta', mount);
    async function showWeather(lat,lon){ tempEl.textContent='Loading…'; try{
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
      const res = await fetch(url); if(!res.ok) throw new Error('Weather API'); const j=await res.json(); const cur=j.current_weather; tempEl.textContent = `${Math.round(cur.temperature)}°C`; condEl.textContent = `Winds ${Math.round(cur.windspeed)} km/h`;
      locEl.textContent = j.timezone || `${lat.toFixed(2)},${lon.toFixed(2)}`; meta.textContent = `Weather code: ${cur.weathercode}`;
    }catch(e){ tempEl.textContent='Unable to load weather'; condEl.textContent=''; meta.textContent=''; }
    }

    function gdFail(){ showWeather(40.7128,-74.0060); }
    if(navigator.geolocation){ navigator.geolocation.getCurrentPosition(p=> showWeather(p.coords.latitude, p.coords.longitude), ()=> gdFail(), { timeout:8000 }); } else gdFail();
  }

  /* -------------------- Clock & Background & Theme -------------------- */
  function initClockAndTheme(){
    const el = qs('#datetime'); function tick(){ const d=new Date(); el.textContent = d.toLocaleString(undefined,{weekday:'short',month:'short',day:'numeric'}) + ' · ' + d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}); }
    tick(); setInterval(tick,1000);

    // Dynamic background
    function backgroundTick(){ const h=new Date().getHours(); const doc=document.documentElement; if(h>=5 && h<12) doc.style.background = 'linear-gradient(180deg,#f7fbff,#dfeeff)';
      else if(h>=12 && h<17) doc.style.background='linear-gradient(180deg,#e6f7ff,#cfefff)';
      else if(h>=17 && h<20) doc.style.background='linear-gradient(180deg,#ffd1a9,#ffb3a9)';
      else doc.style.background='linear-gradient(180deg,#0b1220,#071024)'; }
    backgroundTick(); setInterval(backgroundTick, 1000*60*5);

    const toggle = qs('#themeToggle'); toggle.addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-theme'); const next = cur==='light'? 'dark':'light'; if(next==='dark'){ document.documentElement.removeAttribute('data-theme'); } else document.documentElement.setAttribute('data-theme','light'); ls.set('pd-theme', next==='dark'? null: next);
      toggle.setAttribute('aria-pressed', String(next==='light'));
    });
  }

  /* -------------------- Helpers -------------------- */
  function formatTime(s){ const m=Math.floor(s/60); const sec = s%60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }
  function formatHour(h){ const am = h<12; const hour = ((h+11)%12)+1; return `${hour}:00 ${am? 'AM':'PM'}`; }
  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

  /* -------------------- Notification Manager -------------------- */
  function createNotificationManager(){
    const REM_KEY = 'pd-reminders';
    let permission = (window.Notification && Notification.permission) || 'denied';
    let requestedOnAction = false;
    const notified = new Set();
    const reminders = new Map(); // id -> {time, title, body, sourceId}
    let intervalId = null;

    // Toast container
    function ensureToastWrap(){ let wrap = document.querySelector('.pd-toast-wrap'); if(!wrap){ wrap = document.createElement('div'); wrap.className='pd-toast-wrap'; document.body.appendChild(wrap); } return wrap; }
    function showToast(title, body){ const wrap = ensureToastWrap(); const el = document.createElement('div'); el.className='pd-toast'; el.innerHTML = `<strong>${escapeHtml(title)}</strong><div>${escapeHtml(body||'')}</div>`; wrap.appendChild(el); setTimeout(()=> el.remove(), 6000); }

    function persist(){ const arr = Array.from(reminders.entries()).map(([id,obj])=>({id, ...obj})); try{ localStorage.setItem(REM_KEY, JSON.stringify(arr)); }catch(e){} }
    function load(){ try{ const arr = JSON.parse(localStorage.getItem(REM_KEY)||'[]'); arr.forEach(a=> reminders.set(a.id, {time:a.time, title:a.title, body:a.body, source:a.source})); }catch(e){} }

    function requestPermissionOnUserAction(){
      if(requestedOnAction) return; requestedOnAction = true;
      if(!('Notification' in window)) return; // unsupported
      if(Notification.permission === 'default'){
        Notification.requestPermission().then(p=>{ permission = p; });
      } else { permission = Notification.permission; }
    }

    function sendNotification(id,title,body,opts={}){
      if(notified.has(id)) return; // avoid duplicates
      notified.add(id);
      try{
        if(window.Notification && Notification.permission==='granted'){
          const n = new Notification(title, { body, tag: opts.tag });
          n.onclick = () => { window.focus(); try{ window.focus(); }catch(e){} };
        } else {
          // fallback
          showToast(title, body);
        }
      }catch(e){ showToast(title, body); }
    }

    function scheduleReminder(id, timeISO, title, body, source){
      if(!timeISO) return; const t = Date.parse(timeISO); if(isNaN(t)) return;
      reminders.set(id, { time: t, title, body, source }); persist();
      ensureInterval();
    }

    function removeReminder(id){ if(reminders.delete(id)){ persist(); } }
    function removeRemindersMatching(fn){ let removed=false; reminders.forEach((r,id)=>{ if(fn(r,id)){ reminders.delete(id); removed=true; } }); if(removed) persist(); }

    function ensureInterval(){ if(intervalId) return; intervalId = setInterval(checkDue, 30*1000); checkDue(); }
    function checkDue(){ const now = Date.now(); reminders.forEach((r, id)=>{
      if(r.time <= now && !notified.has(id)){
        sendNotification(id, r.title, r.body||'', { tag: r.source });
        reminders.delete(id); // one-shot
      }
    }); persist(); if(reminders.size===0 && intervalId){ clearInterval(intervalId); intervalId=null; }
    }

    load(); if(reminders.size>0) ensureInterval();

    return { requestPermissionOnUserAction, scheduleReminder, removeReminder, removeRemindersMatching, sendNotification };
  }

  const Notif = createNotificationManager();

  /* -------------------- Feature Registry -------------------- */
  const featureRegistry = {
    todo: initTodo,
    planner: initPlanner,
    goals: initGoals,
    pomodoro: initPomodoro,
    quotes: initQuotes,
    weather: initWeather
  };

  /* -------------------- Init -------------------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    const nav = initNavigation();
    initClockAndTheme();
    // Expose nav for console/manual calls
    window.__pd_nav = nav;
  });

})();
