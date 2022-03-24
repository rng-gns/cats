
const container = document.querySelector(".container");


cats.forEach(function(item, idx, arr) {
    container.append(addCat(item));
});
function setIcon(rate) {
    let rateIcon="";
    for (let i=0; i<10; i++) {
        if (i<rate) {
         rateIcon+= `<i class="icon black"></i>`
        }
        else {rateIcon+= `<i class="icon white"></i>`

        }
    }
    return rateIcon;
}

function addCat(cat)
{
    let div= document.createElement("div");
    div.className="cat";
    div.dataset.id = cat.id;
    div.onclick = loadModalData

    let icons= setIcon(cat.rate)

    div.innerHTML=`
            <div class="img_link" style="background-image: url(${cat.img_link})"></div>
            <h2>${cat.name}</h2>
            <div class="rate">${icons}</div>`;
    return div
}

let closeBtn = document.querySelector('.btn-close');
closeBtn.addEventListener('click', modalClose);

function modalClose(){
    document.querySelector('body')
        .classList.remove('modal-active')
    document.querySelector('.modal-wrap')
        .classList.remove('active')
}
function catAge(age){
    let n_1 = age % 100;
    let n_2 = n_1 % 10;
    let result=`${age} лет`

    if (n_1 > 10 && n_1 < 20) {
        result=`${age} лет`
    }
    else if (n_2 > 1 && n_2  < 5) {
        result=`${age} года`
    }
    else if (n_2 === 1) {
        result=`${age} год`
    }
    return result
}
function loadModalData(){
    let id = this.dataset.id;
    let catData = getModalData(id);
    let modalWrap = document.querySelector('.modal-wrap');
    let modalContent = modalWrap.querySelector('.modal-content');
    let age = catAge(catData.age)
    modalContent.innerHTML = `
        <div class="img" style="background-image: url(${catData.img_link})"></div>
        <div class="info">
            <div class="name">${catData.name} <span>(${age})</span></div>
            <div class="description">${catData.description}</div>
        </div>
    `;
    document.body.classList.add('modal-active')
    modalWrap.classList.add('active');
}

function getModalData(catId)
{
    return cats.find(item => item.id == catId)
}


