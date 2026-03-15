let videos=[]


function getID(url){

const regExp=/(?:youtube\.com\/(?:live\/|watch\?v=)|youtu\.be\/)([^?&]+)/

const match=url.match(regExp)

return match?match[1]:null

}



function createVideoCard(v){

const id=getID(v.url)

const thumb=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`

return `

<div class="video-card" onclick="window.open('${v.url}')">

<div class="video-thumb">

<img src="${thumb}">

</div>

<div class="video-title">

${v.title}

</div>

</div>

`

}



function renderRows(){

const upcomingRow=document.getElementById("upcomingRow")

const latestRow=document.getElementById("latestRow")

upcomingRow.innerHTML=""
latestRow.innerHTML=""


const sorted=videos.sort((a,b)=>new Date(b.date)-new Date(a.date))


sorted.slice(0,10).forEach(v=>{

if(v.type==="upcoming")
upcomingRow.innerHTML+=createVideoCard(v)

else
latestRow.innerHTML+=createVideoCard(v)

})

}



function renderCategories(){

const grid=document.getElementById("categoryGrid")

grid.innerHTML=""

const types=[...new Set(videos.map(v=>v.type))]


types.forEach(type=>{

grid.innerHTML+=`

<div class="category-card">

<img src="placeholder.jpg">

<span>${type}</span>

</div>

`

})

}



fetch("https://opensheet.elk.sh/16IveyFW68vwyVHRIVH9MU0Jblh6HjUQ3PQU_QiE2C/videos")

.then(res=>res.json())

.then(data=>{

videos=data

renderRows()

renderCategories()

})
