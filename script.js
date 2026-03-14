let videos = [];
const members = {
  "Pandavva": { name:"Pandavva", avatar:"https://unavatar.io/youtube/@PANDAVVA" },
  "Sadewa Sagara": { name:"Sadewa Sagara", avatar:"https://unavatar.io/youtube/@Sadewa_Sagara" },
  "Nakula Nalendra": { name:"Nakula Nalendra", avatar:"https://unavatar.io/youtube/@Nakula_Nalendra" }
};

// ambil ID YouTube
function getID(url){
  const regExp = /(?:youtube\.com\/(?:live\/|watch\?v=)|youtu\.be\/)([^?&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// buat card video
function createCard(v){
  const id = getID(v.url);
  if(!id) return "";
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const avatar = members[v.member]?.avatar || "";
  return `
  <div class="card" onclick="window.open('${v.url}','_blank')">
    <div class="thumb">
      <img src="${thumb}">
      <div class="duration">${v.duration}</div>
    </div>
    <div class="title">${v.title}</div>
    <div class="meta">
      <img class="avatar" src="${avatar}">
      <div class="text">
        <div>${v.member}</div>
        <div class="info">${v.date}</div>
      </div>
    </div>
  </div>
  `;
}

// Home preview
function renderHomePreview(){
  const upcomingRow = document.getElementById("upcomingRow");
  const latestRow = document.getElementById("latestRow");
  upcomingRow.innerHTML = "";
  latestRow.innerHTML = "";

  const upcoming = videos.filter(v=>v.upcoming);
  const latest = videos.filter(v=>!v.upcoming)
                       .sort((a,b)=> new Date(b.date) - new Date(a.date));

  upcoming.forEach(v=>upcomingRow.innerHTML+=createCard(v));
  latest.forEach(v=>latestRow.innerHTML+=createCard(v));
}

// Sidebar member
function renderSidebar(){
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML="";
  for(const key in members){
    const m = members[key];
    const div = document.createElement("div");
    div.className="member";
    div.innerHTML=`<img src="${m.avatar}"><span>${m.name}</span>`;
    div.onclick = ()=>renderMemberChannel(key);
    sidebar.appendChild(div);
  }
}

// Grid kategori
function renderCategoryMenu(){
  const categoryMenu = document.getElementById("categoryMenu");
  categoryMenu.innerHTML="";
  const types = [...new Set(videos.map(v=>v.type))];
  types.forEach(type=>{
    const btn = document.createElement("button");
    btn.innerText = type;
    btn.onclick = ()=>scrollToCategory(type);
    categoryMenu.appendChild(btn);
  });
}

// Scroll ke section kategori
function scrollToCategory(type){
  const section = document.getElementById(`section-${type}`);
  if(section) section.scrollIntoView({behavior:"smooth"});
}

// Konten per kategori / member
function renderContentSections(memberFilter=null){
  const container = document.getElementById("contentSections");
  container.innerHTML="";

  let filtered = memberFilter ? videos.filter(v=>v.member===memberFilter) : videos;

  const types = [...new Set(filtered.map(v=>v.type))];

  types.forEach(type=>{
    const section = document.createElement("div");
    section.className="section";
    section.id = `section-${type}`;
    section.innerHTML = `
      <div class="sectionHeader"><h2>${type}</h2></div>
      <div class="row"></div>
    `;
    container.appendChild(section);
    const row = section.querySelector(".row");
    filtered.filter(v=>v.type===type).forEach(v=>{
      row.innerHTML+=createCard(v);
    });
  });
}

// Channel member
function renderMemberChannel(member){
  renderContentSections(member);
}

// Main
document.addEventListener("DOMContentLoaded",()=>{
  fetch("https://opensheet.elk.sh/16IveyFW68vwyVHRIVH9MU0Jblh6HjUQ3PQU_QiE2C8c/pandavva_fansite_video_database")
  .then(res=>res.json())
  .then(data=>{
    videos = data.map(v=>({...v, upcoming:v.upcoming==="TRUE" || v.upcoming===true}));
    renderHomePreview();
    renderSidebar();
    renderCategoryMenu();
    renderContentSections();
  })
  .catch(err=>console.error("Fetch error:",err));

  document.getElementById("homeBtn").onclick = ()=>{
    renderHomePreview();
    renderContentSections();
  };
});
