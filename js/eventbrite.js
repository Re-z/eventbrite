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
    async getAnswer(text, category) {
        let query = await fetch(`https://www.eventbriteapi.com/v3/events/search/?categories=${category}&q=${text}&token=UCZSZ3SIRERUO6BC7LTL`),
            queryJson = await query.json();
        return {
            queryJson
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
            selectedOption = select.options[select.selectedIndex].getAttribute('data-id'),
            selectedText = document.querySelector('#event-name').value;
            eventsAPI.getAnswer(selectedText, selectedOption)
                .then(data => {return data.queryJson.events})
                .then(data => {
                    console.log(data)
                    let output = '';
                    if(data.length === 0) {
                        ui.showError('No results for this query')
                    }
                    data.forEach(el => {
                        output += `
                        <div class="col-md-4 mt-4">
                             <div class="card">
                                  <div class="card-body">
                                       <img class="img-fluid mb-2" src="${el.logo.url}"> 
                                  </div>
                                  <div class="card-body">
                                       <div class="card-text">
                                            <h2 class="text-center card-title">${el.name.text}</h2>
                                            <p class="lead text-info">Event Information:</p>
                                            <p>${el.description.text.substr(0, 100)}....</p>
                                            <span class="badge badge-primary">Location: ${el.start.timezone}</span>
                                            <span class="badge badge-secondary">Date & Time: ${el.start.local}</span>
    
                                            <a href="${el.url}" target="_blank" class="btn btn-primary btn-block mt-4">Get Tickets</a>
                                       </div>
                                  </div>
                             </div>
                        </div>
                   `;
                    })
                    //clear prev result
                    result.innerHTML = '';
                    result.insertAdjacentHTML('afterbegin', output)
                })
            console.log(1);
    }
    showError(errorText) {
        let errorBlock = document.querySelector('#error');
        errorBlock.innerHTML = errorText;
        errorBlock.style.cssText = 'display: block !important';
    }
    hideError() {
        let errorBlock = document.querySelector('#error');
        errorBlock.style.cssText = 'display: none !important';
    }

}


let ui = new Ui();


let submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', function(ev) {
    ev.preventDefault;
    ui.hideError();
    let selectedText = document.querySelector('#event-name').value;
    if(selectedText) {
        ui.queryEvent();
    } else {
        ui.showError('Please, choose a theme or city to search');
    }

});
