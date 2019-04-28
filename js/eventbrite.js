class Events {
    constructor() {
    }
    async getCategories() {
        let categories = await fetch('https://www.eventbriteapi.com/v3/categories/?token=UCZSZ3SIRERUO6BC7LTL'),
            categoriesData = await categories.json();
        return {
            categoriesData
        }
    }
    
}
let eventsAPI = new Events();

class Ui {
    constructor() {
        this.printCategories();
    }
    printCategories() {
        //get promise
        let data = eventsAPI.getCategories();
        // handle promise
        data.then(answer => {
            let data = answer.categoriesData.categories,
                targetToInsert = document.querySelector('#category'),
                categories = '';
            // console.log(data);
            data.forEach(el => {
                //collecting recieved data to the string 'categories'
                let category = `<option data-id="${el.id}">${el.name}</option>`;
                categories += category;
            });
            //insert data to the select
            targetToInsert.insertAdjacentHTML('afterbegin', categories);
        })
    }
    queryEvent() {
        let select = document.querySelector('#category'),
            selectedOption = select.options[select.selectedIndex].getAttribute('data-id');
              
    }

}


let ui = new Ui();


let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', function(ev) {
    ev.preventDefault;
    ui.queryEvent();
});
