// Data awal (bisa diganti fetch dari Sheet)
let videos=[];

const members={
  "Pandavva":{name:"Pandavva", avatar:"https://unavatar.io/youtube/@PANDAVVA"},
  "Sadewa Sagara":{name:"Sadewa Sagara", avatar:"https://unavatar.io/youtube/@Sadewa_Sagara"},
  "Nakula Nalendra":{name:"Nakula Nalendra", avatar:"https://unavatar.io/youtube/@Nakula_Nalendra"}
};

// Ambil ID YouTube
function getID(url){ 
  const regExp=/(?:youtube\.com\/(?:live\/|watch\?v=)|youtu\.be\/)([^?&]+)/;
  const match=url.match(regExp); 
  return match?match[1]:null; 
}

// Buat card video
function createCard(v){
  const id=getID(v.url); if(!id) return "";
  const thumb=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const avatar=members[v.member]?.avatar||"";
  return `<div class="card" onclick="window.open('${v.url}','_blank')">
    <div class="thumb"><img src="${thumb}"><div class="duration">${v.duration}</div></div>
    <div class="title">${v.title}</div>
    <div class="meta"><img class="avatar" src="${avatar}">
      <div class="text"><div>${v.member}</div><div class="info">${v.date}</div></div>
    </div>
  </div>`;
}

// Render Home Preview
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

// Grid Kategori
function renderCategoryMenu(){
  const categoryMenu=document.getElementById("categoryMenu");
  categoryMenu.innerHTML="";
  const types=[...new Set(videos.map(v=>v.type))];
  types.forEach(type=>{
    const btn=document.createElement("button");
    btn.innerText=type;
    btn.onclick=()=>scrollToCategory(type);
    categoryMenu.appendChild(btn);
  });
}

// Scroll ke section kategori
function scrollToCategory(type){
  const section=document.getElementById(`section-${type}`);
  if(section) section.scrollIntoView({behavior:"smooth"});
}

// Section grid konten
function renderContentSections(memberFilter=null){
  const container=document.getElementById("contentSections");
  container.innerHTML="";
  let filtered=memberFilter?videos.filter(v=>v.member===memberFilter):videos;
  const types=[...new Set(filtered.map(v=>v.type))];
  types.forEach(type=>{
    const section=document.createElement("div");
    section.className="section"; section.id=`section-${type}`;
    section.innerHTML=`<h2>${type}</h2><div class="grid-bottom"></div>`;
    container.appendChild(section);
    const grid=section.querySelector(".grid-bottom");
    filtered.filter(v=>v.type===type).forEach(v=>{ grid.innerHTML+=createCard(v); });
  });
}

// Sidebar overlay
function toggleSidebar(){ 
  document.getElementById("sidebarOverlay").classList.toggle("active"); 
}

function renderSidebarContent(){
  const container=document.getElementById("sidebarContent");
  container.innerHTML="";
  for(const key in members){
    const m=members[key];
    const div=document.createElement("div");
    div.className="member";
    div.innerHTML=`<img src="${m.avatar}"><span>${m.name}</span>`;
    div.onclick=()=>{
      renderContentSections(key); toggleSidebar();
    };
    container.appendChild(div);
  }
  const groups=["Group A","Group B"];
  groups.forEach(g=>{
    const div=document.createElement("div");
    div.className="member";
    div.innerHTML=`<img src="https://i.imgur.com/6VBx3io.png"><span>${g}</span>`;
    div.onclick=()=>{
      renderGroupSection(g); toggleSidebar();
    };
    container.appendChild(div);
  });
}

// Placeholder scroll ke group
function renderGroupSection(g){ alert(`Scroll to ${g} section`); }

// Load database (ganti ke Sheet JSON-mu)
fetch("https://opensheet.elk.sh/16IveyFW68vwyVHRIVH9MU0Jblh6HjUQ3PQU_QiE2C8c/pandavva_fansite_video_database")
.then(res=>res.json())
.then(data=>{
  videos=data.sort((a,b)=> new Date(b.date)-new Date(a.date));
  renderSidebarContent();
  renderHomePreview();
  renderCategoryMenu();
  renderContentSections();
});

document.getElementById("homeBtn").onclick=()=>{ renderHomePreview(); window.scrollTo({top:0, behavior:"smooth"}); }
