const container = document.querySelector(".container");

let path = {
    getAll: "http://sb-cats.herokuapp.com/api/2/nadin1986/show",
    getOne: "http://sb-cats.herokuapp.com/api/2/nadin1986/show/",
    getId: "http://sb-cats.herokuapp.com/api/2/nadin1986/ids",
    add: "http://sb-cats.herokuapp.com/api/2/nadin1986/add",
    upd: "http://sb-cats.herokuapp.com/api/2/nadin1986/update/",
    del: "http://sb-cats.herokuapp.com/api/2/nadin1986/delete/"
}

if (container != null) {
    fetch(path.getAll)
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if (result.data) {
                let cats = [];
                result.data.forEach(cat => {
                    // проверка: загружать котов только с id
                    if (cat.id != undefined){
                        container.append(addCat(cat));
                        cats.push(cat)
                    }
                });

                //добавляем в localStorage новый ключ (cats) со значением (JSON.stringify(result.data)
                localStorage.setItem('cats', JSON.stringify(cats));
            }
        });
}


// cats.forEach(function(item, idx, arr) {
//     container.append(addCat(item));
// });

function setIcon(rate) {
    let rateIcon = "";
    for (let i = 0; i < 10; i++) {
        if (i < rate) {
            rateIcon += `<i class="icon black"></i>`
        } else {
            rateIcon += `<i class="icon white"></i>`
        }
    }
    return rateIcon;
}

function addCat(cat) {
    let div = document.createElement("div");
    div.className = "cat";
    div.dataset.id = cat.id;
    div.onclick = loadModalData

    let icons = setIcon(cat.rate)

    div.innerHTML = `
            <div class="img_link" style="background-image: url(${cat.img_link})"></div>
            <h2>${cat.name}</h2>
            <div class="rate">${icons}</div>`;
    return div
}

let closeBtn = document.querySelector('.btn-close');
if (closeBtn != null) {
    closeBtn.addEventListener('click', modalClose);
}


function modalClose() {
    document.querySelector('body')
        .classList.remove('modal-active')
    document.querySelector('.modal-wrap')
        .classList.remove('active')
}

function catAge(age) {
    if(age==undefined) {
        return "Возраст не указан"
    }
    let n_1 = age % 100;
    let n_2 = n_1 % 10;
    let result = `${age} лет`

    if (n_1 > 10 && n_1 < 20) {
        result = `${age} лет`
    } else if (n_2 > 1 && n_2 < 5) {
        result = `${age} года`
    } else if (n_2 === 1) {
        result = `${age} год`
    }
    return result
}

function loadModalData() {
    let id = this.dataset.id;
    let modalWrap = document.querySelector('.modal-wrap');
    let modalContent = modalWrap.querySelector('.modal-content');

//Берем определенное значение из хранилища по ключу (cats) и спарсим его обратно в объект
    let localCats = JSON.parse(localStorage.getItem('cats'));
    console.log(localCats);


    let catData = localCats.find ((currentValue) => {
        return  currentValue.id==id
    })

    // let catData = result.data;
    let age = catAge(catData.age);

    modalContent.innerHTML = `
                        <div class="img" style="background-image: url(${catData.img_link})"></div>
                        <div class="info">
                            <div class="name">${catData.name} <span>(${age})</span></div>
                            <div class="description">
                                <p>${catData.description}</p>
                                <button onclick="showForm()" class="btn btn-edit" type="submit">Изменить</button>
                                <button  data-id="${catData.id}" class="delete" type="submit">Удалить</button> 
                            </div>
                        </div>
                        <div class="update-form">
                            <form id="editcat" style="display: none">
                            <input class="cat_id" type="hidden" value="${catData.id}" readonly>
                                    <div class="form"
                                        <label for="n">Введите имя питомца</label>
                                        <input value="${catData.name}" readonly class="new_name" type="text" placeholder="Имя питомца" id="n" required>
                                    </div>
                                    <div class="form">
                                        <label for="a">Введите возраст питомца</label>
                                        <input value="${catData.age}" class="new_age" type="number" name="age" placeholder="Возраст" id="a" min="0">
                                    </div>
                                    <div class="form">
                                        <label for="i">Ссылка на фото</label>
                                        <input value="${catData.img_link}" class="new_img" type="text" name="img_link" placeholder="Ссылка" id="i">
                                    </div>
                                    <div class="form">
                                        <label for="r">Рейтинг питомца</label>
                                        <input value="${catData.rate}" class="new_rate" type="number" name="rate" placeholder="Рейтинг" id="r" max="10" min="0">
                                    </div>
                                    <div class="form">
                                        <label for="с">
                                        <input type="checkbox" ${catData.favourite ? 'checked' : ''} id="с"> 
                                        Любимчик?</label>
                                    </div>
                                    <div class="form">
                                        <label for="d">Расскажите о своем питомце</label>
                                        <textarea class="new_description" name="description" placeholder="О питомце" id="d" rows="6">
                                        ${catData.description}
                                        </textarea>
                                    </div>
                                    
                                <button type="submit" >Сохранить</button>
                                </form>
                        </div>
    `;
    document.forms.editcat.addEventListener("submit", editCats);
    document.body.classList.add('modal-active')
    modalWrap.classList.add('active');

    let  catDeleteBtn = document.querySelector('.delete');
    // добавили слушатель события
    catDeleteBtn.addEventListener('click', deleteCat);
}


function showForm() {
    document.querySelector('.info')
        .style.display="none"
    document.querySelector('#editcat')
        .style.display='block'
}

function getModalData(catId) {
    return cats.find(item => item.id == catId)
}

let addForm = document.forms.addCat;

if (addForm != undefined) {
    document.forms.addCat.addEventListener("submit", addCats);
}


async function addCats(e) {
    e.preventDefault();
    let body = {};
    console.log(this.elements)
    for (let i = 0; i < this.elements.length; i++) {
        let el = this.elements[i];
        console.log(el);
        if (el.name) {
            body[el.name] = el.value;
        }
    }
    body.favourite = !body.favourite;

    await getLastId().then(res => {
        console.log(res)
        body.id = res
    })

    console.log(body);
    console.log(JSON.stringify(body));
    fetch(path.add, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if (result.message === "ok") {
                this.reset();
            }
        })
}

function getLastId() {
    return fetch(path.getAll)
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if (result.data) {
                result.data.sort((a, b) => b.id - a.id);
                return result.data[0].id + 1
            }
        });
}

function editCats(e) {
    e.preventDefault();
    let body = {};
    let id = document.querySelector('.cat_id').value

    for (let i = 0; i < this.elements.length; i++) {
        let el = this.elements[i];
        console.log(el);
        if (el.name) {
            body[el.name] = el.value;
        }
    }

    body.favourite = !body.favourite;

    console.log(body);
    console.log(JSON.stringify(body));
    fetch(path.upd + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if (result.message === "ok") {
                window.location.reload(true); //перезагрузка страницы
            }
        })
}

//Удаление карточки с котом
function deleteCat(){
    // определяем id кота открытого в модальном окне
    let catId = this.dataset.id

    if (confirm(`Удалить кота ID: ${catId}?`)){

        fetch(path.del+catId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                if (result.message === "ok") {
                    window.location.reload(true); //перезагрузка страницы
                }
            })
    }

}






