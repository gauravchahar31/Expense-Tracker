window.addEventListener('DOMContentLoaded', (event) => {
    try{
        axios.get('/expense/getExpense/')
        .then(res => {
            checkPremium(res.data.isPremium);
            arrayOfLists = res.data.expenses;
            pagination(res.data.totalExpenses, 10);
            arrayOfLists.forEach(list => {
                addExpenseToList(list);
            })
        })
        .catch(err => {
            console.log(err)
        });
    }
    catch(err){
        console.log(err);
    }
});

function getExpenses(noOfRows){
    try{
        return axios.get(`/expense/getExpense/?page=1&size=${noOfRows}`)
        .then(res => {
            return (res.data);
        })
        .catch(err => console.log(err));
    }
    catch(err){
        console.log(err);
    }
}

async function checkAndShowLeaderboard(){
    try{
        const isPremium = await axios.get('/user/checkPremium')
            .then(res => {
                return res.data;
            })
            .catch(err => {
                console.log(err);
            })
        if(isPremium){
            showLeaderboard();
        }
    }
    catch(err){
        console.log(err);
    }
}

async function updatePagination(){
    try{
        const noOfRows = parseInt(sizeOfPage.options[sizeOfPage.selectedIndex].value);
        const expensesList = await getExpenses(noOfRows);
        const expensesArray = expensesList.expenses;
        document.querySelector('.expenseTableBody').innerHTML = '';
        expensesArray.forEach(list => {
            addExpenseToList(list);
        })
        pagination(expensesList.totalExpenses, noOfRows);
    }
    catch(err){
        console.log(err);
    }
}

const sizeOfPage = document.getElementById("sizeOfPage");
sizeOfPage.addEventListener("change", async () => {
    try{
        updatePagination();
    }
    catch(err){
        console.log(err);
    }
});

function pagination(totalExpenses, noOfRows){
    try{
        const container = document.querySelector('.pagination');
        container.innerHTML = '';
        let noOfPages = Math.floor(totalExpenses/noOfRows);
        if(totalExpenses%noOfRows){
            noOfPages += 1;
        }
        for(let i=1; i <= noOfPages; i++){
            const li = document.createElement('li');
            li.setAttribute('class', 'page-item');

            const a = document.createElement('a');
            a.setAttribute('class', 'page-link');
            a.setAttribute("style", "color: #E9E8E8; background-color: #913175; border-color: #CD5888;")
            a.innerHTML = i;

            a.addEventListener('click', async () => {
                const sizeOfPage = document.getElementById('sizeOfPage').value;
                axios.get(`/expense/getExpense/?page=${a.innerHTML}&size=${sizeOfPage}`)
                .then(res => {
                    arrayOfLists = res.data.expenses;
                    document.querySelector('.expenseTableBody').innerHTML = '';
                    arrayOfLists.forEach(list => {
                        addExpenseToList(list);
                    })
                })
                .catch(err => {
                    console.log(err);
                })
            })
            li.appendChild(a);
            container.appendChild(li);
        }
    }
    catch(err){
        console.log(err);
    }
}

function checkPremium(isPremium){
    try{
        if(isPremium !== true){
            const container = document.querySelector('.leaderboardColumn');
            const premiumBox = document.createElement('div');
            premiumBox.setAttribute('class', 'premiumBox');
            container.appendChild(premiumBox);
    
            const paymentButton = document.createElement('button');
            paymentButton.setAttribute('id', 'rzp-button1');
            paymentButton.setAttribute('class', 'btn btn-primary');
            paymentButton.setAttribute('style', 'color: #E9E8E8; background-color: #913175; border-color: #CD5888;')
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
    catch(err){
        console.log(err);
    }
}

async function showLeaderboard(){
    try{
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
            if(leaderBoardCounter <= 5){
                const tr = document.createElement('tr');
                const th = document.createElement('th');
                const tdName = document.createElement('td');
                const tdExpense = document.createElement('td');
                th.setAttribute('scope', 'row');

                if(leaderBoardCounter === 1){
                    th.innerHTML = '🥇';
                    leaderBoardCounter++;
                }
                else if(leaderBoardCounter === 2){
                    th.innerHTML = '🥈';
                    leaderBoardCounter++;
                }
                else if(leaderBoardCounter === 3){
                    th.innerHTML = '🥉';
                    leaderBoardCounter++;
                }
                else{
                    th.innerHTML = leaderBoardCounter++;
                }
                tdName.innerHTML = ranker.name;
                tdExpense.innerHTML = ranker.total_cost;

                tbody.appendChild(tr);
                tr.appendChild(th);
                tr.appendChild(tdName);
                tr.appendChild(tdExpense);
            }
        })
    }
    catch(err){
        console.log(err);
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    try{
        e.preventDefault();
        addExpense();
    }
    catch(err){
        console.log(err);
    }
})

function addExpense(){
    try{
        const expenseAmount = document.getElementById('amount').value;
        const expenseDescription = document.getElementById('description').value;
        const expenseCategory = document.getElementById('category').value;

        axios.post('/expense/addExpense', {
            amount : expenseAmount,
            description : expenseDescription,
            category : expenseCategory
        }).then(result => {
            document.querySelector('.newExpense').innerHTML = 'Added Successfully';
            setTimeout( () => {
                document.querySelector('.newExpense').innerHTML = '';
            }, 2000);
            checkAndShowLeaderboard();
            updatePagination();
        })
        .catch(err => {
            console.log(err)
        });
    }
    catch(err){
        console.log(err);
    }
    
}

function deleteExpense(id){
    try{
        axios.delete(`/expense/deleteExpense/${id}`)
            .then(result => {
                checkAndShowLeaderboard();
                updatePagination();
            })
            .catch(err => {
                console.log(err)
            });
    }
    catch(err){
        console.log(err);
    }
   
}

function editExpense(myForm, e){
    try{
        e.preventDefault();
        axios.post(`/expense/editExpense/${myForm.id.value}`, {
            amount : myForm.amount.value,
            description : myForm.desc.value,
            category : myForm.category.value
        })
        .then(result => {
            checkAndShowLeaderboard();
            updatePagination();
        })
        .catch(err => console.log(err));
    }
    catch(err){
        console.log(err);
    }
}

function addExpenseToList(expense){
    try{
        const tableBody = document.querySelector('.expenseTableBody');
        const tableRow = document.createElement('tr');
        const rowDate = document.createElement('th');
        const rowAmount = document.createElement('th');
        const rowDescription = document.createElement('td');
        const rowCategory = document.createElement('td');
        const rowEdit = document.createElement('td');
        const rowDelete = document.createElement('td');
        rowAmount.setAttribute('scope', 'row');

        rowDate.innerHTML = expense.createdAt.split('T')[0];
        rowAmount.innerHTML = expense.amount;
        rowDescription.innerHTML = expense.description;
        rowCategory.innerHTML = expense.category;

        const editButton = document.createElement('button');
        editButton.innerHTML = "Edit";
        editButton.setAttribute("class", "btn btn-success btn-sm  edit")
        editButton.setAttribute("data-toggle", "modal")
        editButton.setAttribute("data-target", "#exampleModalCenter")
        rowEdit.appendChild(editButton);

        const deleteButton = document.createElement('a');
        deleteButton.innerHTML = "X";
        deleteButton.setAttribute("class", "btn btn-danger btn-sm  delete");
        rowDelete.appendChild(deleteButton);

        tableBody.appendChild(tableRow);
        tableRow.appendChild(rowDate);
        tableRow.appendChild(rowAmount);
        tableRow.appendChild(rowDescription);
        tableRow.appendChild(rowCategory);
        tableRow.appendChild(rowEdit);
        tableRow.appendChild(rowDelete);

        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            deleteExpense(expense.id);
            tableBody.removeChild(tableRow);
        })

        editButton.addEventListener('click', () => {
            document.querySelector('#newAmount').value = expense.amount;
            document.querySelector('#newDescription').value = expense.description;
            document.querySelector('#newCategory').value = expense.category;
            document.querySelector('#id').value = expense.id;
            document.querySelector('#editForm').setAttribute("onsubmit", `editExpense(this, event)`);
        });
    }
    catch(err){
        console.log(err);
    }

}

//Reports

document.getElementById('dailyReport').addEventListener('click', async () => {
    try{
        const report = await axios.get('/expense/dailyExpense');
        if(report.data == ''){
            document.querySelector('#subscribeMessage').innerHTML = 'Buy Premium Subscription to access thdi feature!'
            setTimeout(() => {
                document.querySelector('#subscribeMessage').innerHTML = '';
            }, 5000);
        }else{
            var a = document.createElement("a");
            a.href = report.data;
            a.download = 'myexpense.csv';
            a.click();
        }
    }
    catch(err){
        console.log(err);
    }
})

document.getElementById('monthlyReport').addEventListener('click', async () => {
    try{
        const report = await axios.get('/expense/monthlyExpense');
        if(report.data == ''){
            document.querySelector('#subscribeMessage').innerHTML = 'Buy Premium Subscription to access thdi feature!'
            setTimeout(() => {
                document.querySelector('#subscribeMessage').innerHTML = '';
            }, 5000);
        }else{
            var a = document.createElement("a");
            a.href = report.data;
            a.download = 'myexpense.csv';
            a.click();
        }
    }
    catch(err){
        console.log(err);
    }
})

document.getElementById('yearlyReport').addEventListener('click', async () => {
    try{
        const report = await axios.get('/expense/yearlyExpense');
        if(report.data == ''){
            document.querySelector('#subscribeMessage').innerHTML = 'Buy Premium Subscription to access thdi feature!'
            setTimeout(() => {
                document.querySelector('#subscribeMessage').innerHTML = '';
            }, 5000);
        }else{
            var a = document.createElement("a");
            a.href = report.data;
            a.download = 'myexpense.csv';
            a.click();
        }
    }
    catch(err){
        console.log(err);
    }
})


//test jenkins