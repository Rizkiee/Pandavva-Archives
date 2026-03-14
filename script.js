let videos=[];
const members={
  "Pandavva Official":{name:"Pandavva Official", avatar:"https://unavatar.io/youtube/@PANDAVVA"},
  "Sadewa Sagara":{name:"Sadewa Sagara", avatar:"https://unavatar.io/youtube/@Sadewa_Sagara"},
  "Nakula Nalendra":{name:"Nakula Nalendra", avatar:"https://unavatar.io/youtube/@Nakula_Nalendra"}
};

function getID(url){ const regExp=/(?:youtube\.com\/(?:live\/|watch\?v=)|youtu\.be\/)([^?&]+)/; const match=url.match(regExp); return match?match[1]:null; }
function createCard(v){ const id=getID(v.url); if(!id) return ""; const thumb=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`; const avatar=members[v.member]?.avatar||""; return `<div class="card" onclick="window.open('${v.url}','_blank')"><div class="thumb"><img src="${thumb}"><div class="duration">${v.duration}</div></div><div class="title">${v.title}</div><div class="meta"><img class="avatar" src="${avatar}"><div class="text"><div>${v.member}</div><div class="info">${v.date}</div></div></div></div>`; }

// Home Preview
function renderHomePreview(){
  const upcoming=document.getElementById("row-upcoming");
  const latest=document.getElementById("row-latest");
  upcoming.innerHTML=""; latest.innerHTML="";
  const sorted=videos.sort((a,b)=> new Date(b.date)-new Date(a.date));
  sorted.slice(0,10).forEach(v=>{
    if(v.type.toLowerCase()==="upcoming") upcoming.innerHTML+=createCard(v);
    else latest.innerHTML+=createCard(v);
  });
}

// Grid kategori (Grab style)
function renderCategoryMenu(){
  const categoryMenu=document.getElementById("categoryMenu");
  categoryMenu.innerHTML="";
  const types=[...new Set(videos.map(v=>v.type))];
  types.forEach(type=>{
    const btn=document.createElement("button");
    btn.innerText=type;
    btn.onclick=()=>showCategorySection(type); // pindah ke section baru
    categoryMenu.appendChild(btn);
  });
}

// Tampilkan section kategori fullscreen
function showCategorySection(type){
  document.getElementById("homeSection").classList.add("hidden");
  const container=document.getElementById("categorySection");
  container.innerHTML=`<h2>${type}</h2><div class="grid-bottom"></div>`;
  container.classList.remove("hidden");
  const grid=container.querySelector(".grid-bottom");
  videos.filter(v=>v.type===type).forEach(v=>grid.innerHTML+=createCard(v));
}

// Sidebar overlay
function toggleSidebar(){ document.getElementById("sidebarOverlay").classList.toggle("active"); }
function renderSidebarContent(){
  const container=document.getElementById("sidebarContent"); container.innerHTML="";
  for(const key in members){
    const m=members[key]; const div=document.createElement("div");
    div.className="member"; div.innerHTML=`<img src="${m.avatar}"><span>${m.name}</span>`;
    div.onclick=()=>{showMemberSection(key); toggleSidebar();}; container.appendChild(div);
  }
  const groups=["Group A","Group B"];
  groups.forEach(g=>{
    const div=document.createElement("div"); div.className="member"; div.innerHTML=`<img src="https://i.imgur.com/6VBx3io.png"><span>${g}</span>`;
    div.onclick=()=>{showGroupSection(g); toggleSidebar();}; container.appendChild(div);
  });
}

function showMemberSection(member){ document.getElementById("homeSection").classList.add("hidden"); const container=document.getElementById("categorySection"); container.innerHTML=`<h2>${member} Channel</h2><div class="grid-bottom"></div>`; container.classList.remove("hidden"); const grid=container.querySelector(".grid-bottom"); videos.filter(v=>v.member===member).forEach(v=>grid.innerHTML+=createCard(v)); }
function showGroupSection(group){ alert(`Group Section: ${group}`); }

// Load database
fetch("https://opensheet.elk.sh/16IveyFW68vwyVHRIVH9MU0Jblh6HjUQ3PQU_QiE2C8c/videos")
.then(res=>res.json())
.then(data=>{ videos=data.sort((a,b)=> new Date(b.date)-new Date(a.date)); renderSidebarContent(); renderHomePreview(); renderCategoryMenu(); });

document.getElementById("homeBtn").onclick=()=>{ document.getElementById("homeSection").classList.remove("hidden"); document.getElementById("categorySection").classList.add("hidden"); };
