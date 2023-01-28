window.addEventListener('DOMContentLoaded', (event) => {
    axios.get('/expense/getExpense')
    .then(res => {
        checkPremium(res.data.isPremium);
        arrayOfLists = res.data.expenses;
        arrayOfLists.forEach(list => {
            addExpenseToList(list);
        })
    })
    .catch(err => console.log(err));
});

function checkPremium(isPremium){
    if(isPremium !== true){
        const container = document.querySelector('.leaderboardColumn');
        const premiumBox = document.createElement('div');
        premiumBox.setAttribute('class', 'premiumBox');
        container.appendChild(premiumBox);

        const paymentButton = document.createElement('button');
        paymentButton.setAttribute('id', 'rzp-button1');
        paymentButton.innerHTML = "Buy Premium to unlock";
        premiumBox.appendChild(paymentButton);

        paymentButton.addEventListener('click', async (event) => {
            const response = await axios.get('/purchase/premiumSubscription');
            console.log(response);
            const options = {
                "key" : response.data.key_id,
                "order_id" : response.data.order.id,
                "handler" : async function (response){
                    await axios.post('/purchase/updateTransactionStatus', {
                    order_id : options.order_id,
                    payment_id : response.razorpay_payment_id,
                    status : 'SUCCESSFUL'
                })
                showLeaderboard();
                }
            };
            const razorpay = new Razorpay(options)
            razorpay.open();
            event.preventDefault();
            razorpay.on(`payment.failed`, async (response) => {
                await axios.post('/purchase/updateTransactionStatus', {
                    order_id : options.order_id,
                    payment_id : response.razorpay_payment_id,
                    status : 'FAILED'
                })
            alert('Payment Failed');
            });
        });
    }else{
        showLeaderboard();
    }
}

async function showLeaderboard(){
    const rankers = await axios.get('/leaderboard/getRankers');
    const container = document.querySelector('.leaderboardColumn');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.setAttribute('class', 'table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    container.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);

    thead.innerHTML = `<tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Expense</th>
                      </tr>`;
    let leaderBoardCounter = 1;
    rankers.data.forEach( ranker => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const tdName = document.createElement('td');
        const tdExpense = document.createElement('td');
        th.setAttribute('scope', 'row');

        th.innerHTML = leaderBoardCounter++;
        tdName.innerHTML = ranker.name;
        tdExpense.innerHTML = ranker.total_cost;

        tbody.appendChild(tr);
        tr.appendChild(th);
        tr.appendChild(tdName);
        tr.appendChild(tdExpense);
    })
}

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    addExpense();
})

function addExpense(){
    const expenseAmount = document.getElementById('amount').value;
    const expenseDescription = document.getElementById('description').value;
    const expenseCategory = document.getElementById('category').value;

    axios.post('/expense/addExpense', {
        amount : expenseAmount,
        description : expenseDescription,
        category : expenseCategory
    }).then(result => {

        addExpenseToList(result.data);
        showLeaderboard();
    })
    .catch(err => console.log(err));
    
}

function deleteExpense(id){
    axios.delete(`/expense/deleteExpense/${id}`)
    .then(result => {console.log(result)})
    .catch(err => console.log(err));
}

function editExpense(myForm, e){
    e.preventDefault();
    axios.post(`/expense/editExpense/${myForm.id.value}`, {
        amount : myForm.amount.value,
        description : myForm.desc.value,
        category : myForm.category.value
    })
    .then(result => {
        console.log(result);
    })
    .catch(err => console.log(err));
}

function addExpenseToList(expense){
    const container = document.querySelector('ul');
    const newLi = document.createElement('li');
    newLi.setAttribute("class", "list-group-item");
    newLi.innerHTML = `${expense.amount} - ${expense.description}`;
    container.appendChild(newLi);

    const deleteButton = document.createElement('a');
    deleteButton.innerHTML = "X";
    deleteButton.setAttribute("class", "btn btn-danger btn-sm float-right delete")
    newLi.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.innerHTML = "Edit";
    editButton.setAttribute("class", "btn btn-success btn-sm float-right edit")
    editButton.setAttribute("data-toggle", "modal")
    editButton.setAttribute("data-target", "#exampleModalCenter")
    newLi.appendChild(editButton);

    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        deleteExpense(expense.id);
        container.removeChild(newLi);
    })

    editButton.addEventListener('click', () => {
        document.querySelector('#newAmount').value = expense.amount;
        document.querySelector('#newDescription').value = expense.description;
        document.querySelector('#newCategory').value = expense.category;
        document.querySelector('#id').value = expense.id;
        document.querySelector('#editForm').setAttribute("onsubmit", `editExpense(this, event)`);
    });
}

//Paymnets

